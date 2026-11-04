'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  X, 
  Sparkles, 
  Check, 
  Edit3, 
  Calendar, 
  Tag, 
  FileText, 
  AlertCircle,
  Clock
} from 'lucide-react';
import type { Video } from '@/lib/supabase/types';

interface ScriptReviewModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (updatedVideo: Video, scheduleDate?: string) => void;
  onReject?: (video: Video, reason?: string) => void;
}

export function ScriptReviewModal({
  video,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ScriptReviewModalProps) {
  if (!isOpen || !video) return null;

  const [titulo, setTitulo] = useState(video.titulo || video.ideia || '');
  const [roteiro, setRoteiro] = useState(video.roteiro || '');
  const [tags, setTags] = useState<string[]>(video.metadata_seo?.tags || ['ia', 'youtube', 'criadores']);
  const [newTag, setNewTag] = useState('');
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16)
  );
  const [isApproving, setIsApproving] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleApprove = () => {
    setIsApproving(true);
    const updated: Video = {
      ...video,
      titulo,
      roteiro,
      metadata_seo: {
        ...video.metadata_seo,
        tags,
        titulo_otimizado: titulo,
      },
    };
    if (onApprove) {
      onApprove(updated, scheduleDate);
    }
    setTimeout(() => {
      setIsApproving(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Revisão de Conteúdo (Human-in-the-Loop)</h3>
                <StatusPill status={video.status} />
              </div>
              <p className="text-xs text-slate-400">
                Preparado por <span className="text-purple-400 font-semibold">Luca ✍️</span> e <span className="text-emerald-400 font-semibold">Nando 🚀</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Título Otimizado */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Título Otimizado para YouTube (CTR)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Gerado por Nando</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Digite o título do vídeo..."
            />
          </div>

          {/* Tags de SEO */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Tags de SEO</span>
              <span className="text-[10px] text-slate-400 font-mono">{tags.length} selecionadas</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="+ Adicionar tag"
                  className="bg-transparent text-xs text-white placeholder-slate-500 border-none outline-none w-28 px-1"
                />
              </div>
            </div>
          </div>

          {/* Roteiro Editável */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Roteiro Completo (Copy & Storytelling)</span>
              <span className="text-[10px] text-purple-400 font-mono">Gerado por Luca</span>
            </label>
            <textarea
              rows={8}
              value={roteiro}
              onChange={(e) => setRoteiro(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 p-3.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed transition-colors resize-y"
              placeholder="O roteiro gerado pelo Luca aparecerá aqui..."
            />
          </div>

          {/* Agendamento */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-white">Agendamento Automático</p>
                <p className="text-[10px] text-slate-400">Data e hora para o Nando publicar via YouTube API</p>
              </div>
            </div>

            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modal Footer / Decisão do Chefe */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800/80 bg-slate-900/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReject && onReject(video)}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
          >
            Pedir Alterações
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancelar
            </Button>

            <Button
              variant="success"
              size="sm"
              isLoading={isApproving}
              onClick={handleApprove}
              className="text-xs gap-1.5 shadow-lg shadow-emerald-950/40"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Aprovar e Agendar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
