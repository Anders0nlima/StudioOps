'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { FileText, Plus, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Video } from '@/lib/supabase/types';

export default function RoteirosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIdea, setNewIdea] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.success && data.videos) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.warn('Erro ao carregar roteiros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: newTitle,
          ideia: newIdea || newTitle,
          tags: ['ia', 'youtube'],
        }),
      });
      const data = await res.json();

      if (data.success && data.video) {
        setVideos([data.video, ...videos]);
        setNewTitle('');
        setNewIdea('');
        setShowNewModal(false);
        setToastMessage('Nova ideia cadastrada na esteira com sucesso!');
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.warn('Erro ao criar ideia:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Disparar geração de roteiro pelo Luca e Nando
  const handleGenerateScript = async (video: Video) => {
    setGeneratingId(video.id);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: video.id,
          titulo: video.titulo,
          ideia: video.ideia,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id
              ? {
                  ...v,
                  status: 'pendente',
                  roteiro: data.roteiro,
                  metadata_seo: data.metadata_seo,
                  titulo: data.titulo_otimizado,
                }
              : v
          )
        );
        setToastMessage(`Roteiro gerado pelo Luca e SEO formulado pelo Nando! Pronto para aprovação.`);
        setTimeout(() => setToastMessage(null), 4500);
      }
    } catch (err) {
      console.warn('Erro ao gerar roteiro:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <>
      <Header 
        title="Roteiros & Ideações" 
        description="Repositório central de ideias, pesquisas de tendências e roteiros gerados pelo Luca"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Biblioteca de Roteiros</span>
              <Badge variant="outline">{videos.length} itens</Badge>
            </h2>
            <p className="text-xs text-slate-400">Todos os vídeos planejados, em elaboração ou finalizados</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVideos}
              isLoading={isLoading}
              className="text-xs gap-1.5 border-slate-800 bg-slate-900/60"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span>Atualizar</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowNewModal(true)}
              className="text-xs gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Ideia Manual</span>
            </Button>
          </div>
        </div>

        {/* Modal de Nova Ideia Manual */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Adicionar Nova Pauta à Esteira</h3>
              <form onSubmit={handleCreateIdea} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Título ou Tema Central</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Como Criar Vídeos com IA em 2026"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Descrição / Ângulo da Pauta</label>
                  <textarea
                    rows={3}
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    placeholder="Ex: Focar em criadores iniciantes e ferramentas 100% gratuitas."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewModal(false)}
                    className="text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isCreating}
                    className="text-xs"
                  >
                    Salvar na Ideação
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Grid de Roteiros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <Card key={video.id} className="hover:border-slate-700 transition-all flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <StatusPill status={video.status} />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(video.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-white line-clamp-2">
                  {video.titulo || video.ideia}
                </CardTitle>
                <CardDescription className="text-xs text-slate-300 line-clamp-3">
                  {video.ideia || (video.roteiro ? 'Roteiro redigido' : 'Sem descrição')}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {video.metadata_seo?.tags && (
                  <div className="flex flex-wrap gap-1">
                    {video.metadata_seo.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {video.status === 'ideacao' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      isLoading={generatingId === video.id}
                      onClick={() => handleGenerateScript(video)}
                      className="text-xs gap-1.5 w-full bg-purple-600 hover:bg-purple-500 shadow-purple-900/30"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Gerar Roteiro (Luca)</span>
                    </Button>
                  ) : (
                    <a href="/aprovacoes" className="w-full">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5 w-full justify-between"
                      >
                        <span>Abrir na Esteira</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
