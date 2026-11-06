'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Settings, 
  Sparkles,
  Bot,
  Activity,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Visão Geral', href: '/', icon: BarChart3 },
  { label: 'Roteiros', href: '/roteiros', icon: FileText },
  { label: 'Aprovações', href: '/aprovacoes', icon: CheckSquare, badge: 'HITL' },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

const agentsInfo = [
  {
    name: 'Endu',
    role: 'Dados & Sentimento',
    model: 'Gemini 1.5',
    emoji: '📊',
    color: 'text-cyan-400',
    dotBg: 'bg-cyan-400',
    boxStyle: 'pixel-box-cyan',
  },
  {
    name: 'Luca',
    role: 'Roteiro & Copy',
    model: 'Claude 3.5',
    emoji: '✍️',
    color: 'text-purple-400',
    dotBg: 'bg-purple-400',
    boxStyle: 'pixel-box-purple',
  },
  {
    name: 'Nando',
    role: 'SEO & Publicação',
    model: 'GPT-4o',
    emoji: '🚀',
    color: 'text-amber-400',
    dotBg: 'bg-amber-400',
    boxStyle: 'pixel-box-gold',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r-4 border-slate-900 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none shadow-[4px_0px_0px_#000]">
      <div className="flex flex-col">
        {/* Brand / Logo 16-Bit */}
        <div className="p-4 border-b-4 border-slate-900 bg-slate-900/60 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-600 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-amber-300 font-bold">
              <span className="font-arcade text-xs">SO</span>
            </div>
            <div>
              <span className="font-arcade text-[11px] text-amber-300 block tracking-tight">
                STUDIOOPS
              </span>
              <span className="text-[9px] uppercase font-pixel text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 bg-emerald-400 animate-pixel-blink"></span>
                PIXEL AGENTS
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links Retrô */}
        <div className="px-3 py-4 space-y-1.5">
          <p className="px-3 pb-1 text-[9px] font-arcade text-slate-500 uppercase">
            [ MENU ]
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-xs font-pixel transition-all group",
                  isActive
                    ? "bg-indigo-900/40 text-amber-300 border-2 border-indigo-500 shadow-[2px_2px_0px_#000]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border-2 border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn(
                    "text-[10px] font-arcade",
                    isActive ? "text-amber-400" : "text-transparent group-hover:text-slate-500"
                  )}>
                    ▶
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[8px] font-arcade px-1.5 py-0.5 border shadow-[1px_1px_0px_#000]",
                    isActive
                      ? "bg-amber-400 text-black border-black"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pixel Agents Squad Module in Sidebar */}
      <div className="p-3 m-3 pixel-box bg-slate-950 border-2 border-slate-800">
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="font-arcade text-[9px] text-slate-300">SQUAD</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-pixel flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-400 animate-pixel-blink"></span>
            3 ONLINE
          </span>
        </div>

        <div className="space-y-2">
          {agentsInfo.map((agent) => (
            <div
              key={agent.name}
              className="p-2 bg-slate-900/80 border border-slate-800 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm select-none">{agent.emoji}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <span className={cn("text-[10px] font-arcade", agent.color)}>{agent.name}</span>
                  </div>
                  <p className="text-[9px] font-pixel text-slate-400 leading-none">{agent.model}</p>
                </div>
              </div>
              <span className={cn("h-2 w-2 rounded-none", agent.dotBg, "animate-pixel-blink")} title="Online" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

