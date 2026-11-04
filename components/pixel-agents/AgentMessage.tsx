import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PIXEL_AGENTS } from '@/lib/pixel-agents/agents';
import { AgentStateIndicator } from './AgentStateIndicator';
import { Button } from '@/components/ui/Button';
import { Check, Edit3, Clock, Sparkles } from 'lucide-react';
import type { AgentLog } from '@/lib/supabase/types';

interface AgentMessageProps {
  log: AgentLog;
  onApprove?: (log: AgentLog) => void;
  onEdit?: (log: AgentLog) => void;
  className?: string;
}

function formatRelativeTime(dateString: string) {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHours < 24) return `há ${diffHours} h`;
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return 'recente';
  }
}

export function AgentMessage({
  log,
  onApprove,
  onEdit,
  className,
}: AgentMessageProps) {
  const agent = PIXEL_AGENTS[log.agente] || PIXEL_AGENTS.endu;
  const isWaitingApproval = log.estado === 'waiting_approval';

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200",
        isWaitingApproval
          ? "bg-gradient-to-r from-yellow-950/30 via-slate-900/80 to-slate-900/60 border-yellow-600/60 shadow-lg shadow-yellow-950/20"
          : "bg-slate-900/50 hover:bg-slate-900/70 border-slate-800/80",
        className
      )}
    >
      {/* Agent Avatar */}
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 overflow-hidden shadow-inner">
          <Image
            src={agent.avatarUrl}
            alt={agent.name}
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
        </div>
        <span className="absolute -bottom-1 -right-1 text-xs select-none">
          {agent.emoji}
        </span>
      </div>

      {/* Message Body */}
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-bold", agent.accentColor)}>
              {agent.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({agent.model.split(' ')[0]})
            </span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(log.created_at)}
            </span>
          </div>

          <AgentStateIndicator state={log.estado} showLabel />
        </div>

        <p className="text-xs text-slate-200 leading-relaxed break-words">
          {log.mensagem}
        </p>

        {/* Human-in-the-Loop Action Panel (When awaiting approval) */}
        {isWaitingApproval && (
          <div className="mt-3 pt-3 border-t border-yellow-800/40 flex flex-wrap items-center justify-between gap-3 bg-yellow-950/20 p-3 rounded-lg border border-yellow-800/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-200">
                Ação do Chefe Necessária:
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(log)}
                  className="text-xs gap-1.5 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Editar Roteiro</span>
                </Button>
              )}

              {onApprove && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onApprove(log)}
                  className="text-xs gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Aprovar e Agendar</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
