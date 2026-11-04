import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
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
  Clock, 
  TrendingUp, 
  Cpu
} from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header 
        title="StudioOps — Centro de Comando" 
        description="Painel de orquestração autônoma de conteúdo com Pixel Agents"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pixel Agents & Human-in-the-Loop Architecture</span>
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

        {/* Squad Status Overview (Pixel Agents) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-400" />
                <span>Pixel Agents Squad</span>
              </h3>
              <p className="text-xs text-slate-400">Estado operacional da equipe em tempo real</p>
            </div>
            <Badge variant="success">Sistema Conectado</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Endu Card */}
            <Card className="hover:border-blue-500/40 transition-all bg-gradient-to-b from-blue-950/20 to-slate-900/60">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl shadow-sm">
                    📊
                  </div>
                  <div>
                    <CardTitle className="text-blue-300 flex items-center gap-2">
                      Endu
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-xs">Estrategista de Dados & Sentimento</CardDescription>
                  </div>
                </div>
                <Badge variant="info">Gemini 1.5</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300">
                  Monitora métricas, analisa comentários da audiência e identifica novas oportunidades e pautas virais.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Status:</span>
                  <span className="font-mono text-emerald-400 font-medium">idle / pronto</span>
                </div>
              </CardContent>
            </Card>

            {/* Luca Card */}
            <Card className="hover:border-purple-500/40 transition-all bg-gradient-to-b from-purple-950/20 to-slate-900/60">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl shadow-sm">
                    ✍️
                  </div>
                  <div>
                    <CardTitle className="text-purple-300 flex items-center gap-2">
                      Luca
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-xs">Roteirista Criativo & Copywriting</CardDescription>
                  </div>
                </div>
                <Badge variant="purple">Claude 3.5</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300">
                  Gera roteiros estruturados com ganchos de retenção, storytelling e introduções de alto impacto.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Status:</span>
                  <span className="font-mono text-emerald-400 font-medium">idle / pronto</span>
                </div>
              </CardContent>
            </Card>

            {/* Nando Card */}
            <Card className="hover:border-emerald-500/40 transition-all bg-gradient-to-b from-emerald-950/20 to-slate-900/60">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-sm">
                    🚀
                  </div>
                  <div>
                    <CardTitle className="text-emerald-300 flex items-center gap-2">
                      Nando
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-xs">Diretor de SEO & Publicação</CardDescription>
                  </div>
                </div>
                <Badge variant="success">GPT-4o</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300">
                  Otimiza títulos virais, tags e descrições, agendando diretamente a publicação via YouTube Data API.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Status:</span>
                  <span className="font-mono text-emerald-400 font-medium">idle / pronto</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pipeline & Infrastructure Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="h-4 w-4 text-indigo-400" />
                Pipeline Human-in-the-Loop
              </CardTitle>
              <CardDescription>Fluxo de trabalho orquestrado entre IA e você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <StatusPill status="ideacao" />
                    <span className="text-xs text-slate-300">1. Pesquisa de tendências & temas</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Endu</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <StatusPill status="pendente" />
                    <span className="text-xs text-slate-300">2. Roteirização, SEO e revisão humana</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Luca + Nando</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <StatusPill status="aprovado" />
                    <span className="text-xs text-slate-300">3. Decisão do Chefe (Aprovar / Editar)</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold font-mono">Você (Chefe)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <StatusPill status="publicado" />
                    <span className="text-xs text-slate-300">4. Agendamento & Disparo YouTube API</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Nando</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                Infraestrutura & Integrações
              </CardTitle>
              <CardDescription>Status dos componentes de backend e banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Supabase (PostgreSQL)</p>
                    <p className="text-[10px] text-slate-400">Tabelas: videos, comentarios, metricas, agent_logs</p>
                  </div>
                </div>
                <Badge variant="outline">Configurar em .env</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Workflow className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">n8n Orquestrador</p>
                    <p className="text-[10px] text-slate-400">Webhooks de pesquisa, roteiro e publicação</p>
                  </div>
                </div>
                <Badge variant="outline">Pronto para Webhooks</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <YoutubeIcon className="h-4 w-4 text-rose-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200">YouTube Data API v3</p>
                    <p className="text-[10px] text-slate-400">Upload de vídeo, agendamento e leitura de métricas</p>
                  </div>
                </div>
                <Badge variant="outline">OAuth2</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
