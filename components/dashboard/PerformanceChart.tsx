'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const PERFORMANCE_DATA = [
  { dia: '01', views: 4200, likes: 380 },
  { dia: '04', views: 5100, likes: 440 },
  { dia: '07', views: 6800, likes: 610 },
  { dia: '10', views: 5900, likes: 520 },
  { dia: '13', views: 8200, likes: 790 },
  { dia: '16', views: 9400, likes: 910 },
  { dia: '19', views: 8900, likes: 850 },
  { dia: '22', views: 11200, likes: 1180 },
  { dia: '25', views: 12500, likes: 1340 },
  { dia: '28', views: 14100, likes: 1520 },
  { dia: '30', views: 16800, likes: 1850 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg border border-slate-700 bg-slate-950/95 shadow-xl text-xs space-y-1">
        <p className="font-bold text-white">Dia {label}</p>
        <p className="text-indigo-400 font-medium">
          Views: <span className="font-mono">{payload[0].value.toLocaleString('pt-BR')}</span>
        </p>
        <p className="text-purple-400 font-medium">
          Likes: <span className="font-mono">{payload[1].value.toLocaleString('pt-BR')}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function PerformanceChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
        <div>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            <span>Crescimento de Visualizações (30 Dias)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Tráfego impulsionado pelas recomendações do Endu e SEO do Nando
          </CardDescription>
        </div>
        <Badge variant="success">+18.4% este mês</Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#likesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
