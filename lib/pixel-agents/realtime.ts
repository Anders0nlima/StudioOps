'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { AgentLog, AgentName } from '@/lib/supabase/types';
import type { AgentState } from './states';
import { PIXEL_AGENTS } from './agents';

export interface AgentRealtimeState {
  state: AgentState;
  lastMessage: string | null;
  lastActiveAt: string | null;
}

// Mensagens iniciais de demonstração (inspiradas na interação viva do Pixel Agents)
const INITIAL_DEMO_LOGS: AgentLog[] = [
  {
    id: 'demo-1',
    agente: 'endu',
    mensagem: 'Analisei os últimos 100 comentários do canal. A audiência está pedindo com frequência: "Como ganhar dinheiro com IA sem saber programar".',
    tipo: 'info',
    estado: 'done',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'demo-2',
    agente: 'luca',
    mensagem: 'Excelente oportunidade, Endu! Estruturei um roteiro de 8 minutos com 3 ferramentas práticas e uma chamada de retenção nos primeiros 15s.',
    tipo: 'thinking',
    estado: 'working',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'demo-3',
    agente: 'nando',
    mensagem: 'Chefe, revisei o roteiro do Luca e formulei o título viral: "Como Ganhar R$ 5.000/Mês com IA em 2026 (Sem Programar)". As tags de SEO já estão prontas. Aguardo sua aprovação para agendar!',
    tipo: 'success',
    estado: 'waiting_approval',
    created_at: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  },
];

export function usePixelAgents() {
  const [logs, setLogs] = useState<AgentLog[]>(INITIAL_DEMO_LOGS);
  const [agentStates, setAgentStates] = useState<Record<AgentName, AgentRealtimeState>>({
    endu: { state: 'done', lastMessage: INITIAL_DEMO_LOGS[0].mensagem, lastActiveAt: INITIAL_DEMO_LOGS[0].created_at },
    luca: { state: 'working', lastMessage: INITIAL_DEMO_LOGS[1].mensagem, lastActiveAt: INITIAL_DEMO_LOGS[1].created_at },
    nando: { state: 'waiting_approval', lastMessage: INITIAL_DEMO_LOGS[2].mensagem, lastActiveAt: INITIAL_DEMO_LOGS[2].created_at },
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const channelRef = useRef<any>(null);

  // Atualizar estado de um agente individual
  const updateAgentState = useCallback((agent: AgentName, newState: AgentState, message: string) => {
    setAgentStates((prev) => ({
      ...prev,
      [agent]: {
        state: newState,
        lastMessage: message,
        lastActiveAt: new Date().toISOString(),
      },
    }));
  }, []);

  // Adicionar novo log
  const pushLog = useCallback((log: AgentLog) => {
    setLogs((prev) => [log, ...prev]);
    updateAgentState(log.agente, log.estado, log.mensagem);
  }, [updateAgentState]);

  // Transição de estado acionada pelo Human-in-the-Loop ao aprovar conteúdo
  const recordApprovalAction = useCallback(async (videoId: string, targetDate: string) => {
    updateAgentState('nando', 'working', 'Enviando metadados e agendando no YouTube API...');

    const newLog: AgentLog = {
      id: `log-${Date.now()}`,
      agente: 'nando',
      video_id: videoId,
      mensagem: `🚀 Vídeo aprovado pelo Chefe e agendado com sucesso para ${new Date(targetDate).toLocaleString('pt-BR')} no YouTube!`,
      tipo: 'success',
      estado: 'done',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('agent_logs').insert({
        agente: newLog.agente,
        video_id: newLog.video_id,
        mensagem: newLog.mensagem,
        tipo: newLog.tipo,
        estado: newLog.estado,
      });
    } catch (e) {
      console.warn('[PixelAgents] Erro ao gravar log no Supabase:', e);
    }

    pushLog(newLog);
  }, [pushLog, updateAgentState]);

  useEffect(() => {
    async function fetchInitialLogs() {
      try {
        const { data, error } = await supabase
          .from('agent_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          setLogs(data as AgentLog[]);
          
          const latestStates: Record<AgentName, AgentRealtimeState> = { ...agentStates };
          data.forEach((item: any) => {
            const agentKey = item.agente as AgentName;
            if (latestStates[agentKey] && !latestStates[agentKey].lastActiveAt) {
              latestStates[agentKey] = {
                state: item.estado as AgentState,
                lastMessage: item.mensagem,
                lastActiveAt: item.created_at,
              };
            }
          });
          setAgentStates(latestStates);
        }
      } catch (err) {
        console.warn('[PixelAgents] Supabase fetch fallback para demo data');
      }
    }

    fetchInitialLogs();

    try {
      const channel = supabase
        .channel('pixel_agents_feed')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'agent_logs' },
          (payload) => {
            const newLog = payload.new as AgentLog;
            pushLog(newLog);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        });

      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
      };
    } catch (e) {
      console.warn('[PixelAgents] Realtime offline, rodando em modo local');
    }
  }, [pushLog]);

  return {
    logs,
    agentStates,
    isConnected,
    pushLog,
    updateAgentState,
    recordApprovalAction,
  };
}
