'use client';

import React, { useState } from 'react';
import { PixelDeskEndu } from './PixelDeskEndu';
import { PixelDeskLuca } from './PixelDeskLuca';
import { PixelDeskNando } from './PixelDeskNando';
import { usePixelAgents } from '@/lib/pixel-agents/realtime';
import { useRouter } from 'next/navigation';

interface PixelOfficeProps {
  onTriggerResearch?: () => void;
  isResearching?: boolean;
}

export function PixelOffice({
  onTriggerResearch,
  isResearching = false,
}: PixelOfficeProps) {
  const { agentStates, logs } = usePixelAgents();
  const router = useRouter();
  const [coffeeBreak, setCoffeeBreak] = useState(false);

  // Mensagens mais recentes para cada agente
  const enduLog = logs.find((l) => l.agente === 'endu')?.mensagem || 
    "Analisei tendências de mercado e encontrei oportunidades com alto potencial viral.";
  const lucaLog = logs.find((l) => l.agente === 'luca')?.mensagem || 
    "Estruturando roteiro com gancho de 3 segundos e retenção máxima.";
  const nandoLog = logs.find((l) => l.agente === 'nando')?.mensagem || 
    "Chefe, roteiro pronto e SEO formatado para YouTube Shorts. Aguardo seu OK!";

  return (
    <div className="pixel-box bg-slate-950 border-4 border-slate-800 p-6 relative overflow-hidden shadow-[6px_6px_0px_#000]">
      {/* Barra de Título Arcade */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b-2 border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-amber-400 animate-pixel-blink"></span>
            <h2 className="font-arcade text-xs md:text-sm text-amber-300 tracking-wider">
              ★ AGENT OFFICE — VIRTUAL STUDIO ★
            </h2>
          </div>
          <p className="font-pixel text-[11px] text-slate-400 mt-1">
            Equipe autônoma de inteligência artificial trabalhando em tempo real no escritório pixelado.
          </p>
        </div>

        {/* Indicadores de Status 16-Bit */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 text-[10px] font-pixel text-emerald-400 flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
            <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pixel-blink"></span>
            <span>REALTIME SYNC</span>
          </div>

          <button
            onClick={() => setCoffeeBreak(!coffeeBreak)}
            className="pixel-btn pixel-btn-primary text-[8px] py-1.5 px-3"
            title="Pausa para café dos agentes"
          >
            ☕ {coffeeBreak ? 'VOLTAR AO TRABALHO' : 'PAUSA PRO CAFÉ'}
          </button>
        </div>
      </div>

      {/* Cenário do Escritório com Chão Quadriculado e Luz Isométrica */}
      <div className="relative pixel-office-floor border-2 border-slate-800 p-6 crt-overlay">
        {/* Luz solar da janela (efeito translúcido retrô) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-br from-amber-200 via-transparent to-transparent"
          style={{ clipPath: 'polygon(0 0, 45% 0, 75% 100%, 0% 100%)' }}
        />

        {/* Grade com as 3 Mesas dos Agentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Mesa do Endu (Dados / Gemini) */}
          <PixelDeskEndu
            state={coffeeBreak ? 'idle' : isResearching ? 'working' : agentStates.endu?.state || 'idle'}
            latestMessage={coffeeBreak ? "Tomando um café e lendo relatórios de mercado ☕" : enduLog}
            isActionLoading={isResearching}
            onClick={() => {
              if (onTriggerResearch) onTriggerResearch();
            }}
          />

          {/* Mesa do Luca (Roteiro / Claude) */}
          <PixelDeskLuca
            state={coffeeBreak ? 'idle' : agentStates.luca?.state || 'idle'}
            latestMessage={coffeeBreak ? "Ouvindo música retrô no fone de ouvido 🎧" : lucaLog}
            onClick={() => router.push('/roteiros')}
          />

          {/* Mesa do Nando (SEO & Publicação / GPT-4o) */}
          <PixelDeskNando
            state={coffeeBreak ? 'idle' : agentStates.nando?.state || 'waiting_approval'}
            latestMessage={coffeeBreak ? "Ajustando o foguete de brinquedo na mesa 🚀" : nandoLog}
            onClick={() => router.push('/aprovacoes')}
          />
        </div>

        {/* Rodapé do Escritório: Decoração e Itens de Sala */}
        <div className="mt-6 pt-4 border-t-2 border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] font-pixel text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span>📚 BIBLIOTECA DE DADOS</span>
            <span>☕ MÁQUINA DE CAFÉ: 100% CHEIA</span>
            <span>🪴 PLANTA PIXEL: REGADA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerResearch}
              disabled={isResearching}
              className="pixel-btn pixel-btn-gold text-[9px]"
            >
              ⚡ DISPARAR PESQUISA (ENDU)
            </button>
            <button
              onClick={() => router.push('/aprovacoes')}
              className="pixel-btn pixel-btn-primary text-[9px]"
            >
              📝 FILA DE APROVAÇÕES (HITL) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
