'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const VIDEO_COMPARISON_DATA = [
  { video: 'Canal Dark com IA', views: 94200, ctr: 9.8 },
  { video: '5 IAs Pouco Conhecidas', views: 68400, ctr: 8.4 },
  { video: 'Quanto Paga 100k Views', views: 82100, ctr: 11.2 },
  { video: 'Automação com n8n', views: 39800, ctr: 7.6 },
];

function CustomBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg border border-slate-700 bg-slate-950/95 shadow-xl text-xs space-y-1">
        <p className="font-bold text-white">{label}</p>
        <p className="text-indigo-400 font-medium">
          Views: <span className="font-mono">{payload[0].value.toLocaleString('pt-BR')}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function VideoComparisonChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span>Comparativo de Desempenho por Vídeo</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Performance dos conteúdos gerados pelo Luca e otimizados pelo Nando
          </CardDescription>
        </div>
        <Badge variant="outline">Top 4 Vídeos</Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VIDEO_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="video" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="views"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
