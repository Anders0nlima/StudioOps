'use client';

import React from 'react';
import { AgentState } from '@/lib/supabase/types';

interface PixelDeskEnduProps {
  state?: AgentState;
  latestMessage?: string;
  onClick?: () => void;
  isActionLoading?: boolean;
}

export function PixelDeskEndu({
  state = 'idle',
  latestMessage = "Aguardando próxima análise de pautas...",
  onClick,
  isActionLoading = false,
}: PixelDeskEnduProps) {
  const isWorking = state === 'working' || isActionLoading;

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-150 p-4 pixel-box ${
        isWorking ? 'pixel-box-cyan ring-2 ring-cyan-400' : 'hover:border-cyan-500'
      }`}
    >
      {/* Balão de Fala RPG Flutuante */}
      <div className="mb-3">
        <div className="pixel-bubble text-[10px] leading-relaxed max-w-[280px] bg-slate-900 border-2 border-cyan-400 text-cyan-200 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-1.5 font-arcade text-[8px] text-cyan-400 mb-1">
            <span>● ENDU</span>
            <span className="text-slate-400 font-sans">| Gemini 1.5</span>
            {isWorking && <span className="animate-pixel-blink text-amber-400">⚡ MINERANDO</span>}
          </div>
          <p className="line-clamp-2">{latestMessage}</p>
        </div>
      </div>

      {/* Ilustração Pixel Art da Mesa do Endu */}
      <div className="relative flex justify-center items-center py-2">
        <svg
          viewBox="0 0 160 120"
          className="w-48 h-36"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
        >
          {/* Sombra da Mesa no Chão */}
          <rect x="20" y="105" width="120" height="8" fill="#0b0d17" />

          {/* Mesa de Madeira 16-Bit */}
          <rect x="25" y="65" width="110" height="10" fill="#9a3412" />
          <rect x="25" y="75" width="110" height="25" fill="#7c2d12" />
          <rect x="30" y="78" width="40" height="18" fill="#431407" />
          <rect x="46" y="86" width="8" height="3" fill="#f59e0b" /> {/* Puxador gaveta */}
          {/* Pernas da Mesa */}
          <rect x="28" y="100" width="8" height="8" fill="#431407" />
          <rect x="124" y="100" width="8" height="8" fill="#431407" />

          {/* Computador CRT Retrô de Tubo */}
          <rect x="38" y="32" width="44" height="34" fill="#cbd5e1" />
          <rect x="40" y="34" width="40" height="30" fill="#94a3b8" />
          <rect x="44" y="38" width="32" height="22" fill="#022c22" />
          {/* Suporte monitor */}
          <rect x="54" y="66" width="12" height="4" fill="#64748b" />
          
          {/* Tela do Monitor (Matriz de Dados / Gráficos) */}
          {isWorking ? (
            <g className="crt-screen-green">
              <rect x="46" y="40" width="28" height="18" fill="#064e3b" />
              <rect x="48" y="44" width="6" height="10" fill="#10b981" />
              <rect x="56" y="48" width="6" height="6" fill="#34d399" />
              <rect x="64" y="42" width="6" height="12" fill="#6ee7b7" />
              <rect x="71" y="41" width="2" height="4" fill="#a7f3d0" className="animate-pixel-blink" />
            </g>
          ) : (
            <g>
              <rect x="46" y="40" width="28" height="18" fill="#042f2e" />
              <line x1="48" y1="52" x2="72" y2="52" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
              <rect x="68" y="50" width="3" height="3" fill="#10b981" />
            </g>
          )}

          {/* Teclado e Mouse Retrô */}
          <rect x="42" y="70" width="34" height="4" fill="#cbd5e1" />
          <rect x="80" y="71" width="6" height="3" fill="#cbd5e1" />

          {/* Personagem Pixel: Endu (Estrategista) */}
          <g className={isWorking ? "animate-pixel-bounce" : ""}>
            {/* Cadeira de Escritório */}
            <rect x="94" y="45" width="24" height="30" fill="#1e293b" />
            <rect x="103" y="75" width="6" height="28" fill="#0f172a" />
            <rect x="96" y="103" width="20" height="4" fill="#020617" />

            {/* Corpo / Camisa Ciano */}
            <rect x="96" y="52" width="20" height="24" fill="#0891b2" />
            <rect x="102" y="55" width="6" height="20" fill="#06b6d4" />
            {/* Braços digitando */}
            <rect x="82" y="64" width="16" height="5" fill="#0891b2" />
            <rect x="78" y="66" width="6" height="4" fill="#fed7aa" /> {/* Mãozinha */}

            {/* Cabeça / Cabelo Castanho */}
            <rect x="96" y="32" width="18" height="20" fill="#fed7aa" />
            <rect x="94" y="28" width="22" height="8" fill="#573a08" />
            <rect x="94" y="34" width="4" height="6" fill="#573a08" />

            {/* Óculos Pixel Art do Endu */}
            <rect x="94" y="38" width="7" height="5" fill="#000000" />
            <rect x="95" y="39" width="5" height="3" fill="#38bdf8" />
            <rect x="102" y="38" width="7" height="5" fill="#000000" />
            <rect x="103" y="39" width="5" height="3" fill="#38bdf8" />
            <rect x="100" y="40" width="3" height="2" fill="#000000" /> {/* Ponte óculos */}
          </g>

          {/* Adereço: Quadro de Tendências na Parede */}
          <rect x="10" y="8" width="32" height="22" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2" />
          <path d="M 14 24 L 20 18 L 26 22 L 36 12" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="36" cy="12" r="2" fill="#38bdf8" />
          
          {/* Adereço: Livro de Dados na Mesa */}
          <rect x="88" y="67" width="12" height="6" fill="#0284c7" />
          <rect x="90" y="68" width="8" height="4" fill="#e0f2fe" />
        </svg>
      </div>

      {/* Barra de Status e Ação */}
      <div className="mt-3 flex items-center justify-between border-t-2 border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 font-pixel text-[11px] text-cyan-300">
          <span className={`inline-block w-2 h-2 ${isWorking ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`}></span>
          <span>{isWorking ? 'PESQUISANDO...' : 'PRONTO (IDLE)'}</span>
        </div>
        <button 
          className="pixel-btn pixel-btn-primary text-[8px] py-1.5 px-3"
          disabled={isWorking}
        >
          {isWorking ? 'RODANDO...' : 'PESQUISAR'}
        </button>
      </div>
    </div>
  );
}

