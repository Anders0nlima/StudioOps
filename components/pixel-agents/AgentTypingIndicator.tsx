import React from 'react';
import { cn } from '@/lib/utils';
import { PIXEL_AGENTS } from '@/lib/pixel-agents/agents';
import type { AgentName } from '@/lib/supabase/types';

interface AgentTypingIndicatorProps {
  agentId?: AgentName;
  className?: string;
}

export function AgentTypingIndicator({
  agentId = 'luca',
  className,
}: AgentTypingIndicatorProps) {
  const agent = PIXEL_AGENTS[agentId] || PIXEL_AGENTS.luca;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 w-fit text-xs text-slate-400 select-none",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{agent.emoji}</span>
        <span className={cn("font-bold text-xs", agent.accentColor)}>{agent.name}</span>
        <span className="text-slate-400">está formulando resposta</span>
      </div>

      <div className="flex items-center gap-1 px-1">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
      </div>
    </div>
  );
}
