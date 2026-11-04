'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2, Bot } from 'lucide-react';

interface Recommendation {
  id: string;
  topic: string;
  reason: string;
  commentCount: number;
  sentiment: string;
  suggestedTags: string[];
}

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    topic: 'Ferramentas de IA Gratuitas que Substituem Softwares Pagos em 2026',
    reason: 'Forte demanda nos comentários por alternativas sem assinatura mensal.',
    commentCount: 48,
    sentiment: '95% positivo',
    suggestedTags: ['ia-gratis', 'ferramentas-ia', 'produtividade', 'economizar'],
  },
  {
    id: 'rec-2',
    topic: 'Setup de Automação com n8n e IA: Do Zero ao Primeiro Vídeo',
    reason: 'Seguidores pedindo tutorial prático de infraestrutura e webhooks.',
    commentCount: 32,
    sentiment: '91% positivo',
    suggestedTags: ['n8n', 'automacao', 'youtube-api', 'dev'],
  },
  {
    id: 'rec-3',
    topic: 'Top 5 Nichos Mais Lucrativos para Canais sem Rosto no YouTube',
    reason: 'Público com interesse em CPM elevado e estratégias de retenção.',
    commentCount: 27,
    sentiment: '88% positivo',
    suggestedTags: ['canais-dark', 'cpm-alto', 'monetizacao-youtube'],
  },
];

interface RecommendationsPanelProps {
  onSelectTopic?: (topic: Recommendation) => void;
  className?: string;
}

export function RecommendationsPanel({
  onSelectTopic,
  className,
}: RecommendationsPanelProps) {
  const [createdTopics, setCreatedTopics] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCreateScript = async (rec: Recommendation) => {
    setLoadingId(rec.id);
    try {
      // 1. Cadastrar na esteira de vídeos
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: rec.topic,
          ideia: rec.reason,
          tags: rec.suggestedTags,
        }),
      });
      const data = await res.json();

      if (data.success && data.video) {
        // 2. Disparar geração com Luca + Nando
        await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_id: data.video.id,
            titulo: rec.topic,
            ideia: rec.reason,
          }),
        });

        setCreatedTopics((prev) => [...prev, rec.id]);
        if (onSelectTopic) onSelectTopic(rec);
      }
    } catch (err) {
      console.warn('Erro ao criar pauta recomendada:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="space-y-1">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="text-base">📊</span>
            <span>Oportunidades Identificadas pelo Endu</span>
            <Badge variant="purple" className="text-[10px]">Feedback Loop Fechado</Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Pautas extraídas diretamente das dúvidas e pedidos dos seus comentários reais
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {DEMO_RECOMMENDATIONS.map((rec) => {
          const isCreated = createdTopics.includes(rec.id);

          return (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white hover:text-indigo-300 transition-colors">
                    {rec.topic}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 font-medium">
                    <MessageCircle className="h-3 w-3" />
                    <span>{rec.commentCount} pedidos</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {rec.reason}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.suggestedTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                {isCreated ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Na Esteira do Luca</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    isLoading={loadingId === rec.id}
                    onClick={() => handleCreateScript(rec)}
                    className="text-xs gap-1.5 shadow-md shadow-indigo-600/30 whitespace-nowrap"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Gerar Roteiro (Luca)</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
