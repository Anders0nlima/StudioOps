'use client';

import React from 'react';
import { Bot, Sparkles, Activity, RefreshCw } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { AgentRealtimeState } from '@/lib/pixel-agents/realtime';
import type { AgentName } from '@/lib/supabase/types';

interface AgentHQProps {
  agentStates: Record<AgentName, AgentRealtimeState>;
  isConnected?: boolean;
  onTriggerResearch?: () => void;
  isResearching?: boolean;
  className?: string;
}

export function AgentHQ({
  agentStates,
  isConnected = false,
  onTriggerResearch,
  isResearching = false,
  className,
}: AgentHQProps) {
  return (
    <section className={className}>
      {/* Header bar of the HQ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Pixel Agents HQ
              <Badge variant={isConnected ? "success" : "outline"} className="text-[10px]">
                {isConnected ? "Realtime Ativo" : "Demo Realtime"}
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Equipe autônoma de inteligência artificial trabalhando em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerResearch && (
            <Button
              size="sm"
              variant="outline"
              onClick={onTriggerResearch}
              isLoading={isResearching}
              className="text-xs gap-1.5 border-slate-700 bg-slate-900/60 hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
              <span>Disparar Pesquisa (Endu)</span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid of the 3 agents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AgentCard
          agentId="endu"
          currentState={agentStates.endu?.state || 'idle'}
          lastMessage={agentStates.endu?.lastMessage}
        />
        <AgentCard
          agentId="luca"
          currentState={agentStates.luca?.state || 'idle'}
          lastMessage={agentStates.luca?.lastMessage}
        />
        <AgentCard
          agentId="nando"
          currentState={agentStates.nando?.state || 'idle'}
          lastMessage={agentStates.nando?.lastMessage}
        />
      </div>
    </section>
  );
}
