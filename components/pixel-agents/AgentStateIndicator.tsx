import React from 'react';
import { cn } from '@/lib/utils';
import { AGENT_STATES, type AgentState } from '@/lib/pixel-agents/states';

interface AgentStateIndicatorProps {
  state: AgentState;
  showLabel?: boolean;
  className?: string;
}

export function AgentStateIndicator({
  state,
  showLabel = false,
  className,
}: AgentStateIndicatorProps) {
  const config = AGENT_STATES[state] || AGENT_STATES.idle;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {config.isAnimated && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
              config.dotColor
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            config.dotColor
          )}
        />
      </span>

      {showLabel && (
        <span
          className={cn(
            "text-[11px] font-medium border px-2 py-0.5 rounded-full select-none",
            config.badgeBg,
            config.badgeText,
            config.badgeBorder
          )}
        >
          {config.badgeLabel}
        </span>
      )}
    </div>
  );
}
