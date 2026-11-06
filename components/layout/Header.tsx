'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Radio, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  description?: string;
  onTriggerResearch?: () => void;
  isResearching?: boolean;
}

interface WorkerState {
  colabOnline: boolean;
  localOnline: boolean;
  primaryWorker: {
    id: string;
    tipo: string;
    gpu_name: string | null;
  } | null;
}

export function Header({
  title = "Painel de Controle",
  description = "Orquestração de agentes de IA para produção de conteúdo no YouTube",
  onTriggerResearch,
  isResearching = false
}: HeaderProps) {
  const [workerState, setWorkerState] = useState<WorkerState>({
    colabOnline: false,
    localOnline: false,
    primaryWorker: null,
  });

  useEffect(() => {
    async function checkWorkers() {
      try {
        const res = await fetch('/api/workers');
        const data = await res.json();
        if (data.success) {
          setWorkerState({
            colabOnline: data.colabOnline,
            localOnline: data.localOnline,
            primaryWorker: data.primaryWorker,
          });
        }
      } catch {
        // Silencioso se offline
      }
    }

    checkWorkers();
    const interval = setInterval(checkWorkers, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b-4 border-slate-900 bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0px_4px_0px_#000]">
      <div>
        <h1 className="font-arcade text-xs md:text-sm text-amber-300 tracking-tight flex items-center gap-2">
          <span>★</span>
          <span>{title}</span>
        </h1>
        {description && (
          <p className="font-pixel text-[10px] text-slate-400 hidden sm:block mt-0.5">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Worker GPU / Queue Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border-2 border-slate-700 text-[9px] font-arcade shadow-[2px_2px_0px_#000]">
          <Cpu className={`h-3 w-3 ${workerState.colabOnline ? 'text-amber-400 animate-pixel-blink' : workerState.localOnline ? 'text-sky-400' : 'text-slate-500'}`} />
          <span className="text-slate-300">
            {workerState.colabOnline ? 'COLAB' : workerState.localOnline ? 'LOCAL' : 'FILA'}
          </span>
          <span className={workerState.colabOnline ? 'text-amber-400' : workerState.localOnline ? 'text-sky-400' : 'text-slate-400'}>
            {workerState.colabOnline ? 'T4' : workerState.localOnline ? 'OK' : 'WAIT'}
          </span>
        </div>

        {/* Realtime status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border-2 border-slate-700 text-[9px] font-arcade text-emerald-400 shadow-[2px_2px_0px_#000]">
          <Radio className="h-3 w-3 text-emerald-400 animate-pixel-blink" />
          <span className="hidden md:inline text-slate-300">SYNC</span>
          <span>ATIVO</span>
        </div>

        {/* Human-in-the-Loop badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/80 border-2 border-purple-500 text-[9px] font-arcade text-purple-200 shadow-[2px_2px_0px_#000]">
          <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
          <span>HITL 16-BIT</span>
        </div>

        {/* User profile avatar (Chefe) */}
        <div className="flex items-center gap-2 pl-2 border-l-2 border-slate-800">
          <div className="h-8 w-8 bg-amber-500 border-2 border-black flex items-center justify-center font-arcade text-[10px] font-bold text-black shadow-[2px_2px_0px_#000]">
            👑
          </div>
          <div className="hidden xl:block text-left">
            <p className="font-arcade text-[9px] text-amber-300 leading-none">CHEFE</p>
            <p className="font-pixel text-[9px] text-slate-400 mt-0.5">APROVADOR</p>
          </div>
        </div>
      </div>
    </header>
  );
}

