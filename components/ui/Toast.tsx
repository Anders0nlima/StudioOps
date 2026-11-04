'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4500,
  className,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: 'bg-emerald-950/95 border-emerald-700/80 text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    error: {
      bg: 'bg-rose-950/95 border-rose-700/80 text-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
    info: {
      bg: 'bg-indigo-950/95 border-indigo-700/80 text-indigo-200',
      icon: Info,
      iconColor: 'text-indigo-400',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 max-w-md",
        config.bg,
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={cn("h-4 w-4 shrink-0", config.iconColor)} />
        <span className="text-xs font-medium leading-relaxed">{message}</span>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
