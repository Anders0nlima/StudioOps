'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { AgentHQ } from '@/components/pixel-agents/AgentHQ';
import { AgentFeed } from '@/components/pixel-agents/AgentFeed';
import { usePixelAgents } from '@/lib/pixel-agents/realtime';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { YoutubeIcon } from '@/components/ui/Icons';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Database, 
  Workflow, 
  CheckCircle2, 
  TrendingUp, 
  Cpu,
  Layers
} from 'lucide-react';
import type { AgentLog } from '@/lib/supabase/types';

export default function Home() {
  const { logs, agentStates, isConnected, pushLog, updateAgentState } = usePixelAgents();
  const [isResearching, setIsResearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Disparo da API de pesquisa /api/research para acionar o Agente Endu
  const handleTriggerResearch = async () => {
    setIsResearching(true);
    updateAgentState('endu', 'thinking', 'Pesquisando tendências e oportunidades via YouTube & Gemini...');

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema_foco: 'Inteligência Artificial e Ferramentas Práticas' }),
      });
      const data = await res.json();

      if (data.success) {
        pushLog({
          id: `log-${Date.now()}`,
          agente: 'endu',
          mensagem: `Identifiquei 3 novas pautas virais sobre IA e YouTube. A pauta principal foi enviada para o Luca redigir o roteiro!`,
          tipo: 'success',
          estado: 'done',
          created_at: new Date().toISOString(),
        });

        // Luca entra no estado de trabalho
        setTimeout(() => {
          updateAgentState('luca', 'working', 'Estruturando roteiro e storytelling com Claude 3.5 Sonnet...');
        }, 1200);
      }
    } catch (err) {
      console.warn('Erro ao disparar pesquisa:', err);
    } finally {
      setIsResearching(false);
    }
  };

  // Aprovação via API /api/publish diretamente pelo feed
  const handleApproveFromFeed = async (log: AgentLog) => {
    updateAgentState('nando', 'working', 'Enviando metadados e agendando no YouTube API...');
    setToastMessage('Aprovação confirmada! O Nando está disparando a publicação no YouTube.');

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: log.video_id || 'vid-1',
          schedule_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        pushLog({
          id: `log-${Date.now()}`,
          agente: 'nando',
          mensagem: '🚀 Vídeo agendado com sucesso no canal do YouTube! As tags e descrição foram indexadas.',
          tipo: 'success',
          estado: 'done',
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Erro ao publicar:', err);
    } finally {
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <>
      <Header 
        title="StudioOps — Centro de Comando" 
        description="Painel de orquestração autônoma de conteúdo com Pixel Agents"
        onTriggerResearch={handleTriggerResearch}
        isResearching={isResearching}
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Toast Notification */}
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

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pixel Agents Architecture • Human-in-the-Loop</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Equipe Autônoma de Produção para YouTube
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Bem-vindo ao StudioOps. O motor de IA é composto pelos agentes 
                <span className="text-blue-400 font-semibold"> Endu 📊</span> (Análise & Oportunidades), 
                <span className="text-purple-400 font-semibold"> Luca ✍️</span> (Roteirização & Copy) e 
                <span className="text-emerald-400 font-semibold"> Nando 🚀</span> (SEO & Publicação). Você atua como o Chefe no controle da aprovação final.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/aprovacoes">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-600/30">
                  <span>Fila de Aprovações</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/roteiros">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver Roteiros
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Pixel Agents HQ Module */}
        <AgentHQ
          agentStates={agentStates}
          isConnected={isConnected}
          onTriggerResearch={handleTriggerResearch}
          isResearching={isResearching}
        />

        {/* Live Feed + Pipeline Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Live Feed (Slack-style) */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <AgentFeed
                logs={logs}
                agentStates={agentStates}
                onApprove={handleApproveFromFeed}
                onEdit={() => {
                  window.location.href = '/aprovacoes';
                }}
              />
            </CardContent>
          </Card>

          {/* Pipeline Stages & Quick Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-indigo-400" />
                  Pipeline Human-in-the-Loop
                </CardTitle>
                <CardDescription>Fluxo orquestrado com os agentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <StatusPill status="ideacao" />
                    <span className="text-xs text-slate-300">Pesquisa & Oportunidades</span>
                  </div>
                  <span className="text-xs text-blue-400 font-mono font-medium">Endu</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <StatusPill status="pendente" />
                    <span className="text-xs text-slate-300">Roteiro + SEO</span>
                  </div>
                  <span className="text-xs text-purple-400 font-mono font-medium">Luca + Nando</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <StatusPill status="aprovado" />
                    <span className="text-xs text-slate-300">Decisão Humana</span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-semibold">Chefe (Você)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <StatusPill status="publicado" />
                    <span className="text-xs text-slate-300">Disparo YouTube API</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-medium">Nando</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  Infraestrutura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">PostgreSQL (Supabase)</span>
                  <Badge variant="success">Schema Pronto</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Transport Realtime</span>
                  <Badge variant="outline">Websocket</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Orquestrador n8n</span>
                  <Badge variant="success">4 Workflows JSON</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
