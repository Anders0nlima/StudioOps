'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Zap, CheckCircle2 } from 'lucide-react';

interface DateTimeSchedulerProps {
  value: string;
  onChange: (newDate: string) => void;
  className?: string;
}

export function DateTimeScheduler({
  value,
  onChange,
  className,
}: DateTimeSchedulerProps) {
  // Atalhos inteligentes para horários de pico
  const getPresetDate = (hoursFromNow: number, targetHour?: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hoursFromNow);
    if (targetHour !== undefined) {
      d.setHours(targetHour, 0, 0, 0);
    }
    return d.toISOString().slice(0, 16);
  };

  const presets = [
    { label: 'Hoje às 18h (Pico)', val: getPresetDate(0, 18) },
    { label: 'Amanhã às 12h (Almoço)', val: getPresetDate(24, 12) },
    { label: 'Amanhã às 19h (Nobre)', val: getPresetDate(24, 19) },
    { label: 'Em 48h às 18h', val: getPresetDate(48, 18) },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>Agendamento Automático YouTube</span>
          </CardTitle>
          <span className="text-[10px] text-emerald-400 font-mono">YouTube API v3</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Preset chips */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Horários recomendados pelo algoritmo:</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.val)}
                className={`text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                  value === preset.val
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom datetime picker */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium">Ou escolha data e horário personalizado:</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Schedule preview box */}
        <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-indigo-300 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            O Nando subirá o vídeo como <strong>Programado</strong> para {new Date(value).toLocaleString('pt-BR')}.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
