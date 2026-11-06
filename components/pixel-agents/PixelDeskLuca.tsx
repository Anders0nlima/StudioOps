'use client';

import React from 'react';
import { AgentState } from '@/lib/supabase/types';

interface PixelDeskLucaProps {
  state?: AgentState;
  latestMessage?: string;
  onClick?: () => void;
  isActionLoading?: boolean;
}

export function PixelDeskLuca({
  state = 'idle',
  latestMessage = "Preparando a narrativa e gancho dos primeiros 3 segundos...",
  onClick,
  isActionLoading = false,
}: PixelDeskLucaProps) {
  const isWorking = state === 'working' || isActionLoading;

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-150 p-4 pixel-box ${
        isWorking ? 'pixel-box-purple ring-2 ring-purple-400' : 'hover:border-purple-500'
      }`}
    >
      {/* Balão de Fala RPG Flutuante */}
      <div className="mb-3">
        <div className="pixel-bubble text-[10px] leading-relaxed max-w-[280px] bg-slate-900 border-2 border-purple-400 text-purple-200 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-1.5 font-arcade text-[8px] text-purple-400 mb-1">
            <span>● LUCA</span>
            <span className="text-slate-400 font-sans">| Claude 3.5</span>
            {isWorking && <span className="animate-pixel-blink text-amber-400">⚡ ESCREVENDO</span>}
          </div>
          <p className="line-clamp-2">{latestMessage}</p>
        </div>
      </div>

      {/* Ilustração Pixel Art da Mesa do Luca */}
      <div className="relative flex justify-center items-center py-2">
        <svg
          viewBox="0 0 160 120"
          className="w-48 h-36"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
        >
          {/* Sombra da Mesa no Chão */}
          <rect x="20" y="105" width="120" height="8" fill="#0b0d17" />

          {/* Mesa de Madeira 16-Bit */}
          <rect x="25" y="65" width="110" height="10" fill="#854d0e" />
          <rect x="25" y="75" width="110" height="25" fill="#713f12" />
          <rect x="30" y="78" width="40" height="18" fill="#3f2305" />
          <rect x="46" y="86" width="8" height="3" fill="#facc15" /> {/* Puxador gaveta */}
          {/* Pernas da Mesa */}
          <rect x="28" y="100" width="8" height="8" fill="#3f2305" />
          <rect x="124" y="100" width="8" height="8" fill="#3f2305" />

          {/* Computador CRT Retrô de Tubo */}
          <rect x="38" y="32" width="44" height="34" fill="#e2e8f0" />
          <rect x="40" y="34" width="40" height="30" fill="#94a3b8" />
          <rect x="44" y="38" width="32" height="22" fill="#2e1065" />
          {/* Suporte monitor */}
          <rect x="54" y="66" width="12" height="4" fill="#64748b" />
          
          {/* Tela do Monitor (Texto Roteiro Âmbar/Roxo) */}
          <g>
            <rect x="46" y="40" width="28" height="18" fill="#1e1035" />
            <rect x="48" y="43" width="18" height="2" fill="#f59e0b" />
            <rect x="48" y="47" width="24" height="2" fill="#f59e0b" />
            <rect x="48" y="51" width="14" height="2" fill="#f59e0b" />
            {isWorking && (
              <rect x="64" y="51" width="4" height="3" fill="#fbbf24" className="animate-pixel-blink" />
            )}
          </g>

          {/* Teclado e Mouse Retrô */}
          <rect x="42" y="70" width="34" height="4" fill="#cbd5e1" />
          <rect x="80" y="71" width="6" height="3" fill="#cbd5e1" />

          {/* Adereço: Caneca de Café Fumegante */}
          <rect x="30" y="60" width="7" height="9" fill="#e11d48" />
          <rect x="35" y="63" width="3" height="4" fill="#e11d48" />
          {/* Fumaça pixelada saindo do café */}
          <rect x="31" y="55" width="2" height="3" fill="#cbd5e1" className="animate-pixel-bounce" />
          <rect x="34" y="52" width="2" height="3" fill="#cbd5e1" className="animate-pixel-bounce" />

          {/* Adereço: Folhas de Roteiro Empilhadas */}
          <rect x="86" y="66" width="12" height="8" fill="#f8fafc" />
          <rect x="87" y="65" width="12" height="8" fill="#ffffff" />
          <rect x="89" y="68" width="8" height="1" fill="#64748b" />
          <rect x="89" y="70" width="6" height="1" fill="#64748b" />

          {/* Personagem Pixel: Luca (Roteirista com Moletom Roxo e Headphone) */}
          <g className={isWorking ? "animate-pixel-bounce" : ""}>
            {/* Cadeira de Escritório */}
            <rect x="98" y="45" width="24" height="30" fill="#312e81" />
            <rect x="107" y="75" width="6" height="28" fill="#1e1b4b" />
            <rect x="100" y="103" width="20" height="4" fill="#020617" />

            {/* Corpo / Moletom Roxo */}
            <rect x="100" y="52" width="20" height="24" fill="#7c3aed" />
            <rect x="106" y="55" width="8" height="20" fill="#a855f7" />
            {/* Braços digitando */}
            <rect x="86" y="64" width="16" height="5" fill="#7c3aed" />
            <rect x="82" y="66" width="6" height="4" fill="#fde047" /> {/* Mão */}

            {/* Cabeça */}
            <rect x="100" y="32" width="18" height="20" fill="#fde047" />
            {/* Cabelo estilo anime pixel */}
            <rect x="98" y="27" width="22" height="9" fill="#172554" />
            <rect x="97" y="33" width="5" height="8" fill="#172554" />

            {/* Headphone Retrô do Luca */}
            <rect x="96" y="35" width="4" height="10" fill="#f43f5e" />
            <rect x="116" y="35" width="4" height="10" fill="#f43f5e" />
            <path d="M 98 33 A 10 10 0 0 1 118 33" stroke="#f43f5e" strokeWidth="3" fill="none" />

            {/* Olhos concentrados */}
            <rect x="102" y="40" width="3" height="2" fill="#000000" />
            <rect x="109" y="40" width="3" height="2" fill="#000000" />
          </g>

          {/* Adereço: Quadro de Storyboard na Parede */}
          <rect x="10" y="8" width="28" height="22" fill="#2e1065" stroke="#9333ea" strokeWidth="2" />
          <rect x="13" y="12" width="6" height="6" fill="#fde047" />
          <rect x="21" y="12" width="6" height="6" fill="#fde047" />
          <rect x="13" y="20" width="14" height="6" fill="#c084fc" />
        </svg>
      </div>

      {/* Barra de Status e Ação */}
      <div className="mt-3 flex items-center justify-between border-t-2 border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 font-pixel text-[11px] text-purple-300">
          <span className={`inline-block w-2 h-2 ${isWorking ? 'bg-amber-400 animate-ping' : 'bg-purple-400'}`}></span>
          <span>{isWorking ? 'ROTEIRIZANDO...' : 'PRONTO (IDLE)'}</span>
        </div>
        <button 
          className="pixel-btn pixel-btn-primary text-[8px] py-1.5 px-3 bg-purple-600 hover:bg-purple-500"
          disabled={isWorking}
        >
          {isWorking ? 'RODANDO...' : 'VER ROTEIROS'}
        </button>
      </div>
    </div>
  );
}

