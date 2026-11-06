'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { YoutubeIcon } from '@/components/ui/Icons';
import { 
  Lightbulb, 
  Clock, 
  CheckCircle, 
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
    icon: YoutubeIcon,
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
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${col.color}`} />
                  <span className="font-arcade text-[10px] text-white tracking-tight uppercase">
                    {col.title}
                  </span>
                </div>
                <span className="font-arcade text-[9px] px-2 py-0.5 bg-slate-900 border border-slate-700 text-amber-300 shadow-[1px_1px_0px_#000]">
                  {colVideos.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colVideos.length === 0 ? (
                  <div className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 bg-slate-950/40 text-slate-500 text-center p-3">
                    <p className="font-arcade text-[8px] text-slate-400">VAZIO</p>
                    <p className="font-pixel text-[10px] text-slate-500 mt-1">{col.description}</p>
                  </div>
                ) : (
                  colVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => onSelectVideo && onSelectVideo(video)}
                      className={`group pixel-box p-3.5 space-y-2.5 transition-all cursor-pointer select-none ${
                        video.status === 'pendente' 
                          ? 'pixel-box-gold hover:border-amber-400' 
                          : 'bg-slate-950 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <StatusPill status={video.status} />
                        <span className="font-pixel text-[9px] text-slate-400">
                          {new Date(video.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <h5 className="font-pixel text-xs font-bold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {video.titulo || video.ideia || 'Vídeo sem título'}
                      </h5>

                      {video.metadata_seo?.tags && video.metadata_seo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {video.metadata_seo.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="font-pixel text-[8px] px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 shadow-[1px_1px_0px_#000]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="font-pixel text-[9px] text-slate-400 flex items-center gap-1 group-hover:text-amber-300">
                          <FileText className="h-3 w-3" />
                          <span>REVISAR →</span>
                        </span>

                        {video.status === 'pendente' && onApproveVideo && (
                          <button
                            className="pixel-btn pixel-btn-success text-[7px] py-1 px-2.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApproveVideo(video);
                            }}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>APROVAR</span>
                          </button>
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
