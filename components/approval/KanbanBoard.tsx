'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  Lightbulb, 
  Clock, 
  CheckCircle, 
  Youtube, 
  ArrowRight, 
  FileText, 
  Tag, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { Video, VideoStatus } from '@/lib/supabase/types';

interface KanbanBoardProps {
  videos: Video[];
  onSelectVideo?: (video: Video) => void;
  onApproveVideo?: (video: Video) => void;
  className?: string;
}

interface ColumnConfig {
  id: VideoStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeVariant: 'info' | 'warning' | 'success' | 'purple';
  description: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'ideacao',
    title: 'Ideação',
    icon: Lightbulb,
    color: 'text-blue-400',
    badgeVariant: 'info',
    description: 'Pautas identificadas pelo Endu',
  },
  {
    id: 'pendente',
    title: 'Aprovação Pendente',
    icon: Clock,
    color: 'text-amber-400',
    badgeVariant: 'warning',
    description: 'Roteiros prontos para sua revisão',
  },
  {
    id: 'aprovado',
    title: 'Aprovados',
    icon: CheckCircle,
    color: 'text-emerald-400',
    badgeVariant: 'success',
    description: 'Aprovados na fila de agendamento',
  },
  {
    id: 'publicado',
    title: 'Publicados',
    icon: Youtube,
    color: 'text-purple-400',
    badgeVariant: 'purple',
    description: 'Ao vivo no YouTube',
  },
];

export function KanbanBoard({
  videos,
  onSelectVideo,
  onApproveVideo,
  className,
}: KanbanBoardProps) {
  const getVideosByStatus = (status: VideoStatus) => {
    return videos.filter((v) => v.status === status);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colVideos = getVideosByStatus(col.id);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${col.color}`} />
                  <span className="text-xs font-bold text-white tracking-tight">
                    {col.title}
                  </span>
                </div>
                <Badge variant={col.badgeVariant} className="text-[10px] px-1.5 py-0 font-mono">
                  {colVideos.length}
                </Badge>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colVideos.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center border border-dashed border-slate-800/60 rounded-lg text-slate-400 text-center p-3">
                    <p className="text-xs">Nenhum vídeo nesta etapa</p>
                    <p className="text-[10px] text-slate-400 mt-1">{col.description}</p>
                  </div>
                ) : (
                  colVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => onSelectVideo && onSelectVideo(video)}
                      className="group rounded-lg border border-slate-800/90 bg-slate-950/80 p-3.5 space-y-2.5 transition-all hover:border-slate-700 hover:shadow-md cursor-pointer select-none"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <StatusPill status={video.status} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(video.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {video.titulo || video.ideia || 'Vídeo sem título'}
                      </h5>

                      {video.metadata_seo?.tags && video.metadata_seo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {video.metadata_seo.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card actions */}
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-slate-300">
                          <FileText className="h-3 w-3" />
                          <span>Ver detalhes</span>
                        </span>

                        {video.status === 'pendente' && onApproveVideo && (
                          <Button
                            size="sm"
                            variant="success"
                            className="h-6 px-2 text-[10px] gap-1 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApproveVideo(video);
                            }}
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>Aprovar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
