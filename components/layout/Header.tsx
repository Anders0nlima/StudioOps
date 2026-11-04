'use client';

import React from 'react';
import { Sparkles, Radio, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
  description?: string;
  onTriggerResearch?: () => void;
  isResearching?: boolean;
}

export function Header({
  title = "Painel de Controle",
  description = "Orquestração de agentes de IA para produção de conteúdo no YouTube",
  onTriggerResearch,
  isResearching = false
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-slate-400 hidden sm:block">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Connection status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span className="hidden md:inline">Realtime</span>
          <span className="text-emerald-400 font-mono">Ativo</span>
        </div>

        {/* Human-in-the-Loop badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-[11px] text-indigo-300 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span>HITL Mode</span>
        </div>

        {/* User profile avatar (Chefe) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
            CH
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">Chefe</p>
            <p className="text-[10px] text-slate-400">Aprovador Principal</p>
          </div>
        </div>
      </div>
    </header>
  );
}

