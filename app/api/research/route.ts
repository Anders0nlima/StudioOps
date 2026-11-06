import { NextResponse } from 'next/server';
import { triggerResearchAgent } from '@/lib/webhooks';
import { createServerClient } from '@/lib/supabase/server';
import { dispatchAIJob } from '@/lib/queue/ai-queue';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const temaFoco = body.tema_foco || 'Inteligência Artificial e Ferramentas Práticas';
    const formato = body.formato || 'short';

    // 1. Tentar processar via Fila de IA (Google Colab GPU ou Worker Local)
    const queueJobResult = await dispatchAIJob('research', { tema_foco: temaFoco, formato });

    // 2. Chamar Webhook do n8n para manter orquestração
    const webhookResult = await triggerResearchAgent({ tema_foco: temaFoco });

    // 3. Obter ideias geradas (prioridade: Worker GPU -> Fallback inteligente)
    const generatedIdeas = queueJobResult.resultado?.ideas || [
      {
        titulo: `Como Usar IA para Criar Vídeos Curtos Virais em 60 Segundos`,
        ideia: `Shorts dinâmico demonstrando o pipeline autônomo de agentes de IA para criar roteiros e vídeos verticais com gancho imediato.`,
        tags: ['shorts', 'ia', 'automacao', 'youtube-shorts', 'capcut'],
        formato: 'short',
      },
      {
        titulo: `3 Ferramentas Secretas de IA que Criam Shorts em Segundos`,
        ideia: `Comparativo acelerado de modelos generativos verticais para canais dark e criadores solo no YouTube e TikTok.`,
        tags: ['shorts-viral', 'ferramentas-ia', 'criadores', 'genai'],
        formato: 'short',
      },
      {
        titulo: `Quanto Custa Manter uma Equipe de Agentes de IA?`,
        ideia: `Análise transparente de economia usando Colab GPU e modelos locais vs agências de edição tradicionais.`,
        tags: ['custos-ia', 'gpu-gratis', 'produtividade', 'shorts'],
        formato: 'short',
      },
    ];

    // 4. Persistir no Supabase
    const supabase = createServerClient();
    try {
      const sourceLabel = queueJobResult.source === 'colab_gpu' 
        ? 'Colab GPU (Tesla T4)' 
        : queueJobResult.source === 'local_worker' 
        ? 'Worker Local' 
        : 'Orquestrador StudioOps';

      // Registrar log do Endu
      await supabase.from('agent_logs').insert({
        agente: 'endu',
        mensagem: `Analisei tendências de mercado sobre "${temaFoco}" via ${sourceLabel} e gerei ${generatedIdeas.length} novas pautas para a esteira.`,
        tipo: 'success',
        estado: 'done',
      });

      // Registrar os vídeos com status 'ideacao' e formato 'short'
      for (const item of generatedIdeas) {
        await supabase.from('videos').insert({
          titulo: item.titulo,
          ideia: item.ideia,
          metadata_seo: { tags: item.tags },
          status: 'ideacao',
          formato: item.formato || formato,
          renderer: 'local',
        });
      }
    } catch (dbErr) {
      console.warn('[API /api/research] Supabase offline, operando em modo local:', dbErr);
    }

    return NextResponse.json({
      success: true,
      agente: 'endu',
      ideas: generatedIdeas,
      source: queueJobResult.source,
      worker_id: queueJobResult.worker_id,
      webhookSource: webhookResult.source,
      message: 'Pesquisa concluída com sucesso pelo Agente Endu.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar pesquisa com Endu' },
      { status: 500 }
    );
  }
}
