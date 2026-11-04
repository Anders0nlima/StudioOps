import React from 'react';
import { cn } from '@/lib/utils';
import type { VideoStatus } from '@/lib/supabase/types';

interface StatusPillProps {
  status: VideoStatus;
  className?: string;
}

const statusConfig: Record<VideoStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  ideacao: {
    label: 'Ideação',
    dot: 'bg-blue-400',
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-800/50',
  },
  pendente: {
    label: 'Aprovação Pendente',
    dot: 'bg-amber-400 animate-pulse',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-800/50',
  },
  aprovado: {
    label: 'Aprovado',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-800/50',
  },
  publicado: {
    label: 'Publicado',
    dot: 'bg-purple-400',
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-800/50',
  },
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.ideacao;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

