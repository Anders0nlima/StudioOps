import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Settings, Database, Workflow, Key } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <>
      <Header 
        title="Configurações & Conexões" 
        description="Gerenciamento de credenciais do Supabase, endpoints do n8n e chaves de API"
      />

      <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-400" />
              Variáveis de Ambiente (.env.local)
            </CardTitle>
            <CardDescription>
              Para conectar os agentes ao banco e à orquestração, preencha as variáveis de ambiente no arquivo .env.local
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
              <p className="text-slate-500"># Supabase</p>
              <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
              <p>SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...</p>
              <p className="text-slate-500 pt-2"># n8n Webhooks</p>
              <p>NEXT_PUBLIC_N8N_RESEARCH_WEBHOOK_URL=http://localhost:5678/webhook/pesquisar-ideias</p>
              <p>NEXT_PUBLIC_N8N_GENERATE_WEBHOOK_URL=http://localhost:5678/webhook/gerar-roteiro</p>
              <p>NEXT_PUBLIC_N8N_PUBLISH_WEBHOOK_URL=http://localhost:5678/webhook/publicar</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

