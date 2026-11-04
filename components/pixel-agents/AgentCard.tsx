import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PIXEL_AGENTS, type AgentDefinition } from '@/lib/pixel-agents/agents';
import { AGENT_STATES, type AgentState } from '@/lib/pixel-agents/states';
import { AgentStateIndicator } from './AgentStateIndicator';

interface AgentCardProps {
  agentId: 'endu' | 'luca' | 'nando';
  currentState?: AgentState;
  lastMessage?: string | null;
  className?: string;
  onCardClick?: () => void;
}

export function AgentCard({
  agentId,
  currentState = 'idle',
  lastMessage,
  className,
  onCardClick,
}: AgentCardProps) {
  const agent = PIXEL_AGENTS[agentId];
  const stateConfig = AGENT_STATES[currentState] || AGENT_STATES.idle;

  return (
    <div
      onClick={onCardClick}
      className={cn(
        "relative rounded-xl border p-5 transition-all duration-300 bg-gradient-to-b shadow-md overflow-hidden",
        agent.bgGradient,
        agent.borderColor,
        stateConfig.glowEffect,
        onCardClick && "cursor-pointer hover:scale-[1.01]",
        className
      )}
    >
      {/* Top row: Avatar + Identity + State */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-1 shadow-inner overflow-hidden shrink-0">
            <Image
              src={agent.avatarUrl}
              alt={agent.name}
              width={48}
              height={48}
              className="rounded-lg object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className={cn("text-base font-bold tracking-tight", agent.accentColor)}>
                {agent.name}
              </h4>
              <span className="text-xs select-none">{agent.emoji}</span>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-none">{agent.role}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              {agent.model} • {agent.provider}
            </p>
          </div>
        </div>

        <AgentStateIndicator state={currentState} showLabel />
      </div>

      {/* Specialty description */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <p className="text-[11px] text-slate-400">
          <span className="text-slate-400 font-medium">Especialidade: </span>
          {agent.specialty}
        </p>
      </div>

      {/* Speech bubble / Last message */}
      <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
        <span className="text-slate-400 text-xs select-none">💬</span>
        <p className="italic line-clamp-2 leading-relaxed">
          &ldquo;{lastMessage || agent.catchphrase}&rdquo;
        </p>
      </div>
    </div>
  );
}
