'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Eye, 
  ThumbsUp, 
  Smile, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  Video
} from 'lucide-react';

interface MetricItem {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  iconBg: string;
}

const METRICS_DATA: MetricItem[] = [
  {
    title: 'Visualizações no Canal',
    value: '284.5K',
    change: '+18.4%',
    changePositive: true,
    description: 'Últimos 30 dias (YouTube Analytics)',
    icon: Eye,
    accentColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    title: 'Engajamento & Likes',
    value: '24.2K',
    change: '+12.1%',
    changePositive: true,
    description: 'CTR médio de 8.5% nos thumbnails',
    icon: ThumbsUp,
    accentColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
  },
  {
    title: 'Sentimento da Audiência',
    value: '84.2%',
    change: '+5.3%',
    changePositive: true,
    description: 'Aprovado por 340 comentários (Endu)',
    icon: Smile,
    accentColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    title: 'Vídeos na Esteira IA',
    value: '14',
    change: '100%',
    changePositive: true,
    description: 'Agendados e publicados no prazo',
    icon: Video,
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
  },
];

export function MetricsCards({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ''}`}>
      {METRICS_DATA.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="hover:border-slate-700 transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{item.title}</span>
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${item.iconBg}`}>
                  <Icon className={`h-4 w-4 ${item.accentColor}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-white">{item.value}</span>
                <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>{item.change}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
