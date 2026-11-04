'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Smile, Bot } from 'lucide-react';

const SENTIMENT_DATA = [
  { name: 'Positivo', value: 84, color: '#10b981', count: 286 },
  { name: 'Neutro', value: 12, color: '#3b82f6', count: 41 },
  { name: 'Negativo', value: 4, color: '#f43f5e', count: 13 },
];

function SentimentTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-950/95 shadow-xl text-xs space-y-1">
        <p className="font-bold text-white flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </p>
        <p className="text-slate-300">
          {data.value}% ({data.count} comentários)
        </p>
      </div>
    );
  }
  return null;
}

export function SentimentChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <CardTitle className="text-sm flex items-center gap-2">
            <Smile className="h-4 w-4 text-emerald-400" />
            <span>Análise de Sentimento (Gemini 1.5)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Classificação em batch de 340 comentários recentes
          </CardDescription>
        </div>
        <Badge variant="success">84% Positivo</Badge>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col items-center">
        <div className="h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<SentimentTooltip />} />
              <Pie
                data={SENTIMENT_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {SENTIMENT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">84%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Aprovação</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          {SENTIMENT_DATA.map((item) => (
            <div key={item.name} className="space-y-0.5">
              <div className="flex items-center justify-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-white">{item.value}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
