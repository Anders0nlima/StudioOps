'use client';

import React from 'react';
import { AgentState } from '@/lib/supabase/types';

interface PixelDeskNandoProps {
  state?: AgentState;
  latestMessage?: string;
  onClick?: () => void;
  isActionLoading?: boolean;
}

export function PixelDeskNando({
  state = 'idle',
  latestMessage = "Títulos com alto CTR prontos. Aguardando a aprovação do Chefe!",
  onClick,
  isActionLoading = false,
}: PixelDeskNandoProps) {
  const isWorking = state === 'working' || isActionLoading;
  const isWaitingApproval = state === 'waiting_approval';

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-150 p-4 pixel-box ${
        isWaitingApproval 
          ? 'pixel-box-gold ring-2 ring-amber-400 animate-pulse' 
          : isWorking 
          ? 'ring-2 ring-emerald-400' 
          : 'hover:border-amber-500'
      }`}
    >
      {/* Balão de Fala RPG Flutuante */}
      <div className="mb-3">
        <div className="pixel-bubble text-[10px] leading-relaxed max-w-[280px] bg-slate-900 border-2 border-amber-400 text-amber-200 shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-1.5 font-arcade text-[8px] text-amber-400 mb-1">
            <span>● NANDO</span>
            <span className="text-slate-400 font-sans">| GPT-4o</span>
            {isWaitingApproval && <span className="animate-pixel-blink text-amber-400">⚠️ AGUARDA VOCÊ</span>}
          </div>
          <p className="line-clamp-2">{latestMessage}</p>
        </div>
      </div>

      {/* Ilustração Pixel Art da Mesa do Nando */}
      <div className="relative flex justify-center items-center py-2">
        <svg
          viewBox="0 0 160 120"
          className="w-48 h-36"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
        >
          {/* Sombra da Mesa no Chão */}
          <rect x="20" y="105" width="120" height="8" fill="#0b0d17" />

          {/* Mesa de Madeira 16-Bit */}
          <rect x="25" y="65" width="110" height="10" fill="#78350f" />
          <rect x="25" y="75" width="110" height="25" fill="#451a03" />
          <rect x="30" y="78" width="40" height="18" fill="#290e02" />
          <rect x="46" y="86" width="8" height="3" fill="#f59e0b" /> {/* Puxador gaveta */}
          {/* Pernas da Mesa */}
          <rect x="28" y="100" width="8" height="8" fill="#290e02" />
          <rect x="124" y="100" width="8" height="8" fill="#290e02" />

          {/* Computador CRT Retrô de Tubo */}
          <rect x="38" y="32" width="44" height="34" fill="#cbd5e1" />
          <rect x="40" y="34" width="40" height="30" fill="#94a3b8" />
          <rect x="44" y="38" width="32" height="22" fill="#14532d" />
          {/* Suporte monitor */}
          <rect x="54" y="66" width="12" height="4" fill="#64748b" />
          
          {/* Tela do Monitor (SEO & Gráficos de Visualização) */}
          <g>
            <rect x="46" y="40" width="28" height="18" fill="#052e16" />
            <rect x="48" y="43" width="14" height="3" fill="#22c55e" />
            <rect x="48" y="48" width="20" height="3" fill="#eab308" />
            <circle cx="70" cy="46" r="3" fill="#ef4444" /> {/* Botão Play / Tube */}
          </g>

          {/* Teclado e Mouse Retrô */}
          <rect x="42" y="70" width="34" height="4" fill="#cbd5e1" />
          <rect x="80" y="71" width="6" height="3" fill="#cbd5e1" />

          {/* Adereço Especial: Mini Foguete de Brinquedo na Mesa */}
          <g transform="translate(86, 52)">
            <rect x="4" y="0" width="4" height="14" fill="#ef4444" />
            <polygon points="6,0 2,4 10,4" fill="#ffffff" />
            <polygon points="2,10 0,14 4,14" fill="#ffffff" />
            <polygon points="10,10 12,14 8,14" fill="#ffffff" />
            <rect x="5" y="14" width="2" height="2" fill="#f59e0b" className="animate-pixel-blink" />
          </g>

          {/* Personagem Pixel: Nando (Diretor de SEO com Boné) */}
          <g className={isWorking || isWaitingApproval ? "animate-pixel-bounce" : ""}>
            {/* Cadeira de Escritório */}
            <rect x="98" y="45" width="24" height="30" fill="#064e3b" />
            <rect x="107" y="75" width="6" height="28" fill="#022c22" />
            <rect x="100" y="103" width="20" height="4" fill="#020617" />

            {/* Corpo / Jaqueta Verde */}
            <rect x="100" y="52" width="20" height="24" fill="#15803d" />
            <rect x="106" y="55" width="8" height="20" fill="#22c55e" />
            {/* Braços digitando */}
            <rect x="86" y="64" width="16" height="5" fill="#15803d" />
            <rect x="82" y="66" width="6" height="4" fill="#fed7aa" />

            {/* Cabeça */}
            <rect x="100" y="32" width="18" height="20" fill="#fed7aa" />
            {/* Boné Retrô do Nando */}
            <rect x="98" y="27" width="22" height="7" fill="#dc2626" />
            <rect x="94" y="32" width="8" height="3" fill="#dc2626" /> {/* Aba do boné */}

            {/* Olhos pixelados */}
            <rect x="102" y="40" width="3" height="2" fill="#000000" />
            <rect x="109" y="40" width="3" height="2" fill="#000000" />
          </g>

          {/* Balão de Exclamação se Aguardando Aprovação */}
          {isWaitingApproval && (
            <g transform="translate(104, 10)" className="animate-pixel-bounce">
              <rect x="0" y="0" width="14" height="14" fill="#fbbf24" stroke="#000000" strokeWidth="2" />
              <rect x="5" y="3" width="4" height="5" fill="#000000" />
              <rect x="5" y="10" width="4" height="2" fill="#000000" />
            </g>
          )}

          {/* Adereço: Placa Play do YouTube 16-Bit na Parede */}
          <rect x="12" y="10" width="24" height="18" fill="#b91c1c" stroke="#fca5a5" strokeWidth="2" />
          <polygon points="20,15 28,19 20,23" fill="#ffffff" />
        </svg>
      </div>

      {/* Barra de Status e Ação */}
      <div className="mt-3 flex items-center justify-between border-t-2 border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 font-pixel text-[11px] text-amber-300">
          <span className={`inline-block w-2 h-2 ${isWaitingApproval ? 'bg-amber-400 animate-ping' : isWorking ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
          <span>{isWaitingApproval ? 'APROVAÇÃO PENDENTE' : isWorking ? 'OTIMIZANDO...' : 'PRONTO (IDLE)'}</span>
        </div>
        <button 
          className="pixel-btn pixel-btn-gold text-[8px] py-1.5 px-3"
        >
          {isWaitingApproval ? 'REVISAR' : 'VER SEO'}
        </button>
      </div>
    </div>
  );
}

