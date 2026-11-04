'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Edit3, 
  Calendar, 
  Tag, 
  FileText, 
  Clock, 
  AlertCircle,
  Eye,
  Bot
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

  useEffect(() => {
    async function loadVideo() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/videos/${id}`);
        const data = await res.json();
        if (data.success && data.video) {
          setVideo(data.video);
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

  return (
    <>
      <Header 
        title="Estúdio de Revisão Human-in-the-Loop" 
        description="Ambiente detalhado para refinamento de copy, otimização de SEO e validação pelo Chefe"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
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

            {/* Content placeholder to be populated in next commits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{video.titulo || video.ideia}</CardTitle>
                <CardDescription>ID: {video.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300">Carregando painéis de edição de roteiro e metadados...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
