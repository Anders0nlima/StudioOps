'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { PixelOffice } from '@/components/pixel-agents/PixelOffice';
import { AgentHQ } from '@/components/pixel-agents/AgentHQ';
import { AgentFeed } from '@/components/pixel-agents/AgentFeed';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { VideoComparisonChart } from '@/components/dashboard/VideoComparisonChart';
import { RecommendationsPanel } from '@/components/dashboard/RecommendationsPanel';
import { usePixelAgents } from '@/lib/pixel-agents/realtime';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusPill } from '@/components/ui/StatusPill';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Database, 
  Workflow, 
  CheckCircle2, 
  TrendingUp, 
  Cpu,
  Layers,
  BarChart3
} from 'lucide-react';
import type { AgentLog } from '@/lib/supabase/types';

export default function Home() {
  const { logs, agentStates, isConnected, pushLog, updateAgentState } = usePixelAgents();
  const [activeTab, setActiveTab] = useState<'squad' | 'analytics'>('squad');
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

        {/* Hero Banner Estilo Arcade 16-Bit */}
        <div className="relative overflow-hidden pixel-box-purple p-6 md:p-8 shadow-[6px_6px_0px_#000]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950 border-2 border-purple-400 text-purple-300 text-[10px] font-arcade">
                <Sparkles className="h-3 w-3 text-amber-400 animate-pixel-blink" />
                <span>★ 16-BIT AGENTIC STUDIO • HITL READY ★</span>
              </div>
              <h2 className="font-arcade text-lg md:text-2xl text-amber-300 tracking-tight leading-snug">
                Equipe Autônoma de Produção Pixel Art
              </h2>
              <p className="font-pixel text-xs text-slate-300 leading-relaxed">
                Bem-vindo ao StudioOps. O motor de IA é composto pelos agentes 
                <span className="text-cyan-400 font-bold"> Endu 📊</span> (Análise & Oportunidades), 
                <span className="text-purple-400 font-bold"> Luca ✍️</span> (Roteirização & Copy) e 
                <span className="text-amber-400 font-bold"> Nando 🚀</span> (SEO & Publicação). Você atua como o Chefe no controle da aprovação final.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/aprovacoes">
                <button className="pixel-btn pixel-btn-gold text-[10px] w-full sm:w-auto">
                  <span>FILA DE APROVAÇÕES</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </Link>
              <Link href="/roteiros">
                <button className="pixel-btn pixel-btn-primary text-[10px] w-full sm:w-auto">
                  VER ROTEIROS
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs com Estilo Retrô */}
        <div className="flex items-center gap-3 border-b-2 border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('squad')}
            className={`pixel-btn text-[9px] ${
              activeTab === 'squad'
                ? 'pixel-btn-primary'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <Bot className="h-3 w-3" />
            <span>ESCRITÓRIO VIRTUAL & FEED</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`pixel-btn text-[9px] ${
              activeTab === 'analytics'
                ? 'pixel-btn-gold'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <BarChart3 className="h-3 w-3" />
            <span>ANALYTICS & SENTIMENTO</span>
          </button>
        </div>

        {/* Tab 1: Squad & Live Feed View */}
        {activeTab === 'squad' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Virtual Pixel Office (O Escritório dos Agentes) */}
            <PixelOffice
              onTriggerResearch={handleTriggerResearch}
              isResearching={isResearching}
            />

            {/* Live Feed + Pipeline Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Live Feed */}
              <div className="lg:col-span-2 pixel-box p-6 bg-slate-950">
                <AgentFeed
                  logs={logs}
                  agentStates={agentStates}
                  onApprove={handleApproveFromFeed}
                  onEdit={() => {
                    window.location.href = '/aprovacoes';
                  }}
                />
              </div>

              {/* Pipeline Stages & Quick Insights em Pixel Art */}
              <div className="space-y-6">
                <div className="pixel-box p-5 bg-slate-950 space-y-4">
                  <div className="border-b-2 border-slate-800 pb-2">
                    <h3 className="font-arcade text-xs text-amber-300 flex items-center gap-2">
                      <Workflow className="h-3.5 w-3.5 text-indigo-400" />
                      PIPELINE HITL
                    </h3>
                    <p className="font-pixel text-[10px] text-slate-400 mt-1">Fluxo das etapas de criação</p>
                  </div>

                  <div className="space-y-2 font-pixel text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400"></span>
                        <span className="text-slate-300 text-[11px]">1. Pesquisa & Pautas</span>
                      </div>
                      <span className="text-cyan-400 font-arcade text-[8px]">ENDU</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400"></span>
                        <span className="text-slate-300 text-[11px]">2. Roteiro + Cenas</span>
                      </div>
                      <span className="text-purple-400 font-arcade text-[8px]">LUCA</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400"></span>
                        <span className="text-slate-300 text-[11px]">3. SEO Multicanal</span>
                      </div>
                      <span className="text-amber-400 font-arcade text-[8px]">NANDO</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-amber-950/30 border-2 border-amber-500/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 animate-pixel-blink"></span>
                        <span className="text-amber-200 text-[11px] font-bold">4. Aprovação do Chefe</span>
                      </div>
                      <span className="text-amber-400 font-arcade text-[8px]">VOCÊ</span>
                    </div>
                  </div>
                </div>

                <div className="pixel-box p-5 bg-slate-950 space-y-3">
                  <div className="border-b-2 border-slate-800 pb-2">
                    <h3 className="font-arcade text-xs text-emerald-400 flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                      INFRAESTRUTURA
                    </h3>
                  </div>
                  <div className="space-y-2 font-pixel text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fila Supabase</span>
                      <span className="text-emerald-400 font-arcade text-[8px]">CONECTADO</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Realtime Sync</span>
                      <span className="text-cyan-400 font-arcade text-[8px]">ATIVO</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Worker Colab GPU</span>
                      <span className="text-amber-400 font-arcade text-[8px]">STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Analytics & Audience Intelligence View */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Summary Cards */}
            <MetricsCards />

            {/* Performance Trend + Sentiment Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <PerformanceChart />
              </div>
              <div className="lg:col-span-4">
                <SentimentChart />
              </div>
            </div>

            {/* Video Comparison + Endu Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <VideoComparisonChart />
              </div>
              <div className="lg:col-span-7">
                <RecommendationsPanel
                  onSelectTopic={() => {
                    setToastMessage('Pauta selecionada! Luca e Nando começaram a formulação do roteiro.');
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
