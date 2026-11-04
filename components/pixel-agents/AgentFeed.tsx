'use client';

import React from 'react';
import { MessageSquare, Sparkles, Radio } from 'lucide-react';
import { AgentMessage } from './AgentMessage';
import { AgentTypingIndicator } from './AgentTypingIndicator';
import type { AgentLog, AgentName } from '@/lib/supabase/types';
import type { AgentRealtimeState } from '@/lib/pixel-agents/realtime';

interface AgentFeedProps {
  logs: AgentLog[];
  agentStates?: Record<AgentName, AgentRealtimeState>;
  onApprove?: (log: AgentLog) => void;
  onEdit?: (log: AgentLog) => void;
  className?: string;
}

export function AgentFeed({
  logs,
  agentStates,
  onApprove,
  onEdit,
  className,
}: AgentFeedProps) {
  // Verifica se algum agente está atualmente em estado "thinking"
  const thinkingAgent = agentStates
    ? (Object.keys(agentStates) as AgentName[]).find(
        (key) => agentStates[key]?.state === 'thinking'
      )
    : undefined;

  return (
    <div className={className}>
      {/* Feed header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <h4 className="text-sm font-bold text-white">Canal da Equipe (Live Feed)</h4>
          <span className="text-[11px] text-slate-400 font-mono">({logs.length})</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
          <Radio className="h-3 w-3 animate-pulse" />
          <span>Stream Ativo</span>
        </div>
      </div>

      {/* Messages stream */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {thinkingAgent && (
          <AgentTypingIndicator agentId={thinkingAgent} className="mb-2" />
        )}

        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Sparkles className="h-6 w-6 text-slate-600 mx-auto" />
            <p className="text-xs">Nenhuma interação registrada ainda.</p>
            <p className="text-[10px] text-slate-400">
              Quando os agentes forem acionados, as mensagens em tempo real aparecerão aqui.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <AgentMessage
              key={log.id}
              log={log}
              onApprove={onApprove}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
