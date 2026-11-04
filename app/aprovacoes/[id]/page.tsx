'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { DateTimeScheduler } from '@/components/approval/DateTimeScheduler';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Edit3, 
  Tag, 
  FileText, 
  Clock, 
  AlertCircle,
  Copy,
  CheckCheck,
  Send,
  XCircle,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import type { Video } from '@/lib/supabase/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ScriptDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Campos editáveis
  const [titulo, setTitulo] = useState('');
  const [roteiro, setRoteiro] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [descricao, setDescricao] = useState('');
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16)
  );

  // Estados de ação
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    async function loadVideo() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/videos/${id}`);
        const data = await res.json();
        if (data.success && data.video) {
          const v: Video = data.video;
          setVideo(v);
          setTitulo(v.titulo || v.ideia || '');
          setRoteiro(v.roteiro || '');
          setTags(v.metadata_seo?.tags || ['ia', 'youtube-dark', 'renda-extra', 'inteligencia-artificial']);
          setDescricao(
            v.metadata_seo?.descricao ||
            `Aprenda neste vídeo completo como dominar ferramentas de inteligência artificial para automação de canal no YouTube.\n\n⏰ Timestamps:\n0:00 - Introdução\n1:15 - Pesquisa com IA\n3:45 - Roteiro & Storytelling\n7:30 - Conclusão`
          );
        } else {
          setError('Vídeo não encontrado');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados do vídeo');
      } finally {
        setIsLoading(false);
      }
    }

    loadVideo();
  }, [id]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // Métricas do roteiro
  const wordCount = roteiro.trim() ? roteiro.trim().split(/\s+/).length : 0;
  const estimatedReadingMinutes = Math.max(1, Math.ceil(wordCount / 140));

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(roteiro);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Salvar edições sem aprovar (rascunho)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          roteiro,
          metadata_seo: {
            ...video?.metadata_seo,
            tags,
            descricao,
            titulo_otimizado: titulo,
          },
          agendado_para: scheduleDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Edições salvas com sucesso!', 'info');
      }
    } catch (err) {
      showNotification('Erro ao salvar rascunho.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Aprovar e Agendar no YouTube (Commit 4)
  const handleApproveAndPublish = async () => {
    setIsApproving(true);
    try {
      // 1. Salvar alterações pendentes
      await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          roteiro,
          metadata_seo: {
            ...video?.metadata_seo,
            tags,
            descricao,
            titulo_otimizado: titulo,
          },
          agendado_para: scheduleDate,
          status: 'aprovado',
        }),
      });

      // 2. Disparar webhook de publicação
      const publishRes = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: id,
          schedule_date: scheduleDate,
        }),
      });
      const publishData = await publishRes.json();

      if (publishData.success) {
        showNotification(
          `🚀 Vídeo aprovado e agendado com sucesso no canal para ${new Date(scheduleDate).toLocaleString('pt-BR')}!`,
          'success'
        );
        setTimeout(() => {
          router.push('/aprovacoes');
        }, 1500);
      }
    } catch (err) {
      showNotification('Erro ao disparar agendamento com a YouTube API.', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  // Rejeitar / Pedir Ajustes (Commit 5)
  const handleRejectWithFeedback = async () => {
    setIsRejecting(true);
    try {
      await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ideacao',
          ideia: rejectFeedback
            ? `${video?.ideia || titulo} (Ajuste solicitado pelo Chefe: ${rejectFeedback})`
            : video?.ideia,
        }),
      });

      setShowRejectModal(false);
      showNotification('Vídeo devolvido para a etapa de Ideação com o feedback do Chefe.', 'info');
      setTimeout(() => {
        router.push('/aprovacoes');
      }, 1200);
    } catch (err) {
      showNotification('Erro ao devolver pauta.', 'error');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <Header 
        title="Estúdio de Revisão Human-in-the-Loop" 
        description="Ambiente detalhado para refinamento de copy, otimização de SEO e validação pelo Chefe"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Toast Notification (Commit 6) */}
        {toast && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700/80 text-rose-200'
                : 'bg-indigo-950/90 border-indigo-700/80 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-indigo-400" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-300 hover:text-white text-xs px-2"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/aprovacoes">
            <Button variant="ghost" size="sm" className="gap-2 text-xs text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Esteira</span>
            </Button>
          </Link>

          {video && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Status atual:</span>
              <StatusPill status={video.status} />
            </div>
          )}
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400 font-mono">Carregando dados da esteira...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-xl border border-rose-800/80 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold">Erro ao carregar vídeo</p>
              <p className="text-[11px] text-rose-400/80">{error}</p>
            </div>
          </div>
        )}

        {video && !isLoading && (
          <div className="space-y-6">
            {/* Squad authorship banner */}
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-purple-900 border border-purple-500/50 flex items-center justify-center text-xs">
                    ✍️
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-900 border border-emerald-500/50 flex items-center justify-center text-xs">
                    🚀
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Conteúdo Preparado por Luca e Nando</p>
                  <p className="text-[11px] text-slate-400">
                    Roteiro com storytelling e metadados de alta taxa de clique aguardando validação do Chefe
                  </p>
                </div>
              </div>
              <Badge variant="purple">Revisão HITL Ativa</Badge>
            </div>

            {/* Main Dual Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Script Editor */}
              <div className="lg:col-span-7 space-y-4">
                <Card className="flex flex-col h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-400" />
                      <CardTitle className="text-sm">Roteiro Completo (Copy do Luca)</CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyScript}
                        className="h-7 text-xs text-slate-300 hover:text-white gap-1"
                      >
                        {copied ? (
                          <>
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 flex-1 flex flex-col space-y-3">
                    {/* Script metrics bar */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono py-1 px-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                      <span>{wordCount} palavras</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-medium">~{estimatedReadingMinutes} min de vídeo</span>
                      <span>•</span>
                      <span>{roteiro.length} caracteres</span>
                    </div>

                    {/* Script Textarea */}
                    <textarea
                      rows={16}
                      value={roteiro}
                      onChange={(e) => setRoteiro(e.target.value)}
                      placeholder="Cole ou digite o roteiro aqui..."
                      className="w-full flex-1 rounded-xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y transition-colors"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column (5 cols): SEO, Title & Scheduler */}
              <div className="lg:col-span-5 space-y-5">
                {/* Título Otimizado */}
                <Card>
                  <CardHeader className="pb-3 border-b border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
                        Título Otimizado (Nando)
                      </CardTitle>
                      <span className={`text-[10px] font-mono ${titulo.length > 70 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {titulo.length}/70 chars
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título viral para o YouTube..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    <p className="text-[11px] text-slate-400">
                      Títulos com menos de 70 caracteres não são cortados nas telas de smartphones.
                    </p>
                  </CardContent>
                </Card>

                {/* Tags SEO */}
                <Card>
                  <CardHeader className="pb-3 border-b border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Tags para Indexação</span>
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        {tags.length} tags
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-slate-400 hover:text-rose-400 ml-0.5 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}

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
                        placeholder="+ Adicionar tag (Enter)"
                        className="bg-transparent text-[11px] text-white placeholder-slate-500 border-none outline-none w-36 px-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição com Timestamps */}
                <Card>
                  <CardHeader className="pb-3 border-b border-slate-800/80">
                    <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
                      Descrição do YouTube & Timestamps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <textarea
                      rows={4}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição do vídeo..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                    />
                  </CardContent>
                </Card>

                {/* Agendador de Data e Hora (Commit 3) */}
                <DateTimeScheduler
                  value={scheduleDate}
                  onChange={setScheduleDate}
                />
              </div>
            </div>

            {/* Bottom Action Bar (Decision of the Boss) */}
            <div className="sticky bottom-4 z-20 p-4 rounded-xl border border-slate-800/90 bg-slate-900/95 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Pedir Ajustes ao Luca</span>
                </Button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  isLoading={isSaving}
                  className="text-xs gap-1.5 border-slate-700 bg-slate-900 hover:bg-slate-800"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Salvar Rascunho</span>
                </Button>

                <Button
                  variant="success"
                  size="md"
                  onClick={handleApproveAndPublish}
                  isLoading={isApproving}
                  className="text-xs gap-2 shadow-lg shadow-emerald-950/50 font-semibold"
                >
                  <Check className="h-4 w-4" />
                  <span>Aprovar e Agendar no YouTube</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Feedback ao Rejeitar (Commit 5) */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Orientação de Ajuste ao Luca</h3>
                  <p className="text-xs text-slate-400">O que deve ser aprimorado no roteiro?</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Ex: O gancho inicial está muito longo, reduza para 10 segundos e foque na promessa principal de monetização..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRejectWithFeedback}
                  isLoading={isRejecting}
                  className="text-xs gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Devolver para Ideação</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
