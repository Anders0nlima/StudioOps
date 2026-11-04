import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { FileText, Plus, Sparkles } from 'lucide-react';

export default function RoteirosPage() {
  return (
    <>
      <Header 
        title="Roteiros & Ideações" 
        description="Repositório central de ideias, pesquisas de tendências e roteiros gerados pelo Luca"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Biblioteca de Conteúdo</h2>
            <p className="text-xs text-slate-400">Todos os vídeos planejados, em elaboração ou finalizados</p>
          </div>

          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Ideia Manual
          </Button>
        </div>

        <Card className="border-dashed border-slate-800 bg-slate-900/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-semibold text-white">Nenhum roteiro em andamento ainda</h4>
              <p className="text-xs text-slate-400">
                Assim que você conectar seu Supabase e o n8n disparar o agente <span className="text-blue-400 font-semibold">Endu</span>, novas ideias aparecerão aqui automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

