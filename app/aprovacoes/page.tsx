import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckSquare, ShieldCheck, Sparkles } from 'lucide-react';

export default function AprovacoesPage() {
  return (
    <>
      <Header 
        title="Fila de Aprovação (Human-in-the-Loop)" 
        description="Área exclusiva do Chefe para validar roteiros, metadados de SEO e agendar publicação"
      />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Roteiros Aguardando Sua Aprovação</span>
              <Badge variant="warning">0 pendentes</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Nenhum conteúdo será publicado no YouTube sem a sua confirmação explícita.
            </p>
          </div>
        </div>

        <Card className="border-dashed border-slate-800 bg-slate-900/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-semibold text-white">Tudo em dia por aqui, Chefe!</h4>
              <p className="text-xs text-slate-400">
                Quando o <span className="text-purple-400 font-semibold">Luca</span> terminar de redigir e o <span className="text-emerald-400 font-semibold">Nando</span> otimizar o SEO, os cards aparecerão aqui para revisão.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

