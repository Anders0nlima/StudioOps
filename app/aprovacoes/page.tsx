'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/approval/KanbanBoard';
import { ScriptReviewModal } from '@/components/approval/ScriptReviewModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Plus, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import type { Video } from '@/lib/supabase/types';

export default function AprovacoesPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Buscar vídeos da API
  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.warn('Erro ao carregar vídeos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const pendingCount = videos.filter((v) => v.status === 'pendente').length;

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenReview = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // Aprovar vídeo via API /api/publish
  const handleApproveVideo = async (updatedVideo: Video, scheduleDate?: string) => {
    try {
      // 1. Atualizar eventuais edições feitas pelo Chefe via PATCH
      await fetch(`/api/videos/${updatedVideo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: updatedVideo.titulo,
          roteiro: updatedVideo.roteiro,
          metadata_seo: updatedVideo.metadata_seo,
          agendado_para: scheduleDate,
        }),
      });

      // 2. Disparar webhook de publicação e agendamento
      const publishRes = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: updatedVideo.id,
          schedule_date: scheduleDate,
        }),
      });
      const publishData = await publishRes.json();

      setVideos((prev) =>
        prev.map((v) =>
          v.id === updatedVideo.id
            ? { ...updatedVideo, status: 'publicado', youtube_video_id: publishData.youtube_video_id }
            : v
        )
      );

      showToast(`Vídeo "${updatedVideo.titulo}" aprovado e agendado no canal com sucesso!`, 'success');
    } catch (err) {
      showToast('Erro ao processar publicação com a YouTube API.', 'error');
    }
  };

  // Rejeitar vídeo / Pedir alterações via API
  const handleRejectVideo = async (video: Video) => {
    try {
      await fetch(`/api/videos/${video.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ideacao' }),
      });

      setVideos((prev) =>
        prev.map((v) => (v.id === video.id ? { ...v, status: 'ideacao' } : v))
      );
      setIsModalOpen(false);
      showToast('Roteiro retornado para a etapa de Ideação para revisão pelo Luca.', 'info');
    } catch (err) {
      showToast('Erro ao devolver roteiro.', 'error');
    }
  };

  return (
    <>
      <Header 
        title="Fila de Aprovação (Human-in-the-Loop)" 
        description="Painel de controle Kanban: revise roteiros, tags e aprove o agendamento no YouTube"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Toast de Notificação */}
        {toastMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
                : 'bg-blue-950/90 border-blue-700/80 text-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-blue-400" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-300 hover:text-white text-xs px-2"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Top summary bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Esteira de Produção & Aprovação</span>
              <Badge variant="warning">{pendingCount} pendente{pendingCount !== 1 ? 's' : ''}</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Clique nos cards para abrir o editor e revisar a copy do Luca e as tags do Nando.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchVideos}
            isLoading={isLoading}
            className="text-xs gap-1.5 border-slate-800 bg-slate-900/60"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Atualizar Esteira</span>
          </Button>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          videos={videos}
          onSelectVideo={handleOpenReview}
          onApproveVideo={(video) => handleApproveVideo(video)}
        />

        {/* Script Review Modal */}
        <ScriptReviewModal
          video={selectedVideo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApproveVideo}
          onReject={handleRejectVideo}
        />
      </main>
    </>
  );
}
