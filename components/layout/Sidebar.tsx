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
    model: 'Gemini 1.5 Flash',
    emoji: '📊',
    color: 'text-blue-400',
    dotBg: 'bg-blue-400',
    border: 'border-blue-500/30',
  },
  {
    name: 'Luca',
    role: 'Roteiro & Copy',
    model: 'Claude 3.5 Sonnet',
    emoji: '✍️',
    color: 'text-purple-400',
    dotBg: 'bg-purple-400',
    border: 'border-purple-500/30',
  },
  {
    name: 'Nando',
    role: 'SEO & Publicação',
    model: 'GPT-4o',
    emoji: '🚀',
    color: 'text-emerald-400',
    dotBg: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">StudioOps</span>
              <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold flex items-center gap-1">
                Pixel Agents <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide",
                    isActive
                      ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/40"
                      : "bg-slate-800 text-slate-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pixel Agents HQ Module in Sidebar */}
      <div className="p-3 m-3 rounded-xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Pixel Agents</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            3 Online
          </span>
        </div>

        <div className="space-y-2">
          {agentsInfo.map((agent) => (
            <div
              key={agent.name}
              className={cn(
                "p-2 rounded-lg border bg-slate-950/60 flex items-center justify-between transition-all",
                agent.border
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{agent.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-xs font-bold", agent.color)}>{agent.name}</span>
                    <span className="text-[10px] text-slate-400">({agent.model.split(' ')[0]})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-none">{agent.role}</p>
                </div>
              </div>
              <span className={cn("h-2 w-2 rounded-full", agent.dotBg, "animate-pulse")} title="Online" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

