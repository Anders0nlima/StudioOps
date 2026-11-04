'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/approval/KanbanBoard';
import { ScriptReviewModal } from '@/components/approval/ScriptReviewModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import type { Video } from '@/lib/supabase/types';

// Dados de demonstração realistas para visualização imediata da esteira
const DEMO_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    titulo: 'Como Criar um Canal Dark no YouTube com IA em 2026',
    ideia: 'Tutorial passo a passo ensinando a criar vídeos sem aparecer usando IA gratuita',
    roteiro: `[INTRO - 0:00]\n"Se você acha que precisa gastar milhares de reais com câmeras e microfones para ter um canal rentável no YouTube em 2026, você está perdendo tempo. Hoje, uma pessoa sozinha usando três ferramentas gratuitas consegue gerar conteúdos com qualidade de estúdio."\n\n[BLOCO 1 - 1:15]\n"A primeira etapa é a pesquisa de tópicos virais. É aqui que o Gemini se destaca..."\n\n[BLOCO 2 - 3:45]\n"Para a narrativa e roteiro, o Claude 3.5 Sonnet entrega uma retenção 40% superior..."\n\n[CTA FINAL - 7:30]\n"Se você quer a lista completa dos prompts que usamos, deixe seu like e comente 'PROMPTS' abaixo!"`,
    metadata_seo: {
      tags: ['ia', 'youtube-dark', 'renda-extra', 'inteligencia-artificial', 'tutoriais'],
      descricao: 'Descubra como criar um canal dark no YouTube usando apenas ferramentas de inteligência artificial gratuitas.',
      titulo_otimizado: 'Como Criar um Canal Dark no YouTube com IA em 2026 (Passo a Passo)',
    },
    status: 'pendente',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'vid-2',
    titulo: '5 Ferramentas de IA Pouco Conhecidas que Superam o ChatGPT',
    ideia: 'Comparativo prático de ferramentas de nicho para criadores de conteúdo',
    roteiro: null,
    metadata_seo: {
      tags: ['chatgpt', 'ferramentas-ia', 'produtividade'],
    },
    status: 'ideacao',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'vid-3',
    titulo: 'Quanto o YouTube Pagou por 100.000 Visualizações?',
    ideia: 'Abertura de métricas reais de RPM e CPM de vídeos de tecnologia',
    roteiro: 'Roteiro validado e aprovado pelo Chefe.',
    metadata_seo: {
      tags: ['monetizacao', 'cpm-youtube', 'financas'],
      titulo_otimizado: 'Quanto o YouTube Me Pagou por 100 Mil Views? (Valores Reais Revelados)',
    },
    status: 'aprovado',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'vid-4',
    titulo: 'Como Automatizar Seus Vídeos com n8n e IA',
    ideia: 'Tutorial de automação completa com webhook e agentes',
    roteiro: 'Roteiro publicado.',
    metadata_seo: {
      tags: ['n8n', 'automacao', 'youtube-api'],
      titulo_otimizado: 'Automação Completa de YouTube com n8n e Agentes de IA',
    },
    status: 'publicado',
    youtube_video_id: 'dQw4w9WgXcQ',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function AprovacoesPage() {
  const [videos, setVideos] = useState<Video[]>(DEMO_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingCount = videos.filter((v) => v.status === 'pendente').length;

  const handleOpenReview = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleApproveVideo = (updatedVideo: Video, scheduleDate?: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? { ...updatedVideo, status: 'aprovado' } : v))
    );
    setToastMessage(`Vídeo "${updatedVideo.titulo}" aprovado e agendado com sucesso!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRejectVideo = (video: Video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, status: 'ideacao' } : v))
    );
    setIsModalOpen(false);
    setToastMessage(`Vídeo devolvido para a etapa de Ideação para revisão pelo Luca.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      <Header 
        title="Fila de Aprovação (Human-in-the-Loop)" 
        description="Painel de controle Kanban: revise roteiros, tags e aprove o agendamento no YouTube"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Toast de Confirmação */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs px-2"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Esteira de Produção & Aprovação</span>
              <Badge variant="warning">{pendingCount} pendente{pendingCount !== 1 ? 's' : ''}</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Arraste ou clique nos cards para revisar a copy do Luca e as tags do Nando antes de publicar.
            </p>
          </div>
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
