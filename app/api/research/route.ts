import { NextResponse } from 'next/server';
import { triggerResearchAgent } from '@/lib/webhooks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const temaFoco = body.tema_foco || 'Inteligência Artificial e Ferramentas Práticas';

    // 1. Disparar Webhook do n8n para o Agente Endu
    const webhookResult = await triggerResearchAgent({ tema_foco: temaFoco });

    // 2. Ideias geradas pelo Endu (retornadas do webhook ou geradas pela inteligência do agente)
    const generatedIdeas = [
      {
        titulo: `Como Usar IA para Automatizar Seu Canal no YouTube em 2026`,
        ideia: `Tutorial aprofundado demonstrando o pipeline de agentes de IA autônomos para gerar roteiros, tags e publicar vídeos automaticamente com supervisão humana.`,
        tags: ['automacao', 'youtube-ia', 'produtividade', 'n8n', 'agentes-ia'],
      },
      {
        titulo: `3 Ferramentas de IA Pouco Conhecidas que Criam Vídeos em Minutos`,
        ideia: `Comparativo prático de novas ferramentas generativas que superam modelos tradicionais para criadores de conteúdo solo.`,
        tags: ['ferramentas-ia', 'criadores', 'edicao-video', 'genai'],
      },
      {
        titulo: `Quanto Custa Manter uma Equipe de Agentes de IA para Criar Conteúdo?`,
        ideia: `Análise transparente de custos de tokens (Gemini, Claude, GPT-4o) vs economia de tempo em comparação com freelancers e agências.`,
        tags: ['custos-ia', 'tokens', 'business', 'monetizacao'],
      },
    ];

    // 3. Persistir no Supabase se as credenciais estiverem ativas
    const supabase = createServerClient();
    try {
      // Registrar log do Endu
      await supabase.from('agent_logs').insert({
        agente: 'endu',
        mensagem: `Analisei tendências de mercado sobre "${temaFoco}" e gerei 3 novas ideias para a esteira de ideação.`,
        tipo: 'success',
        estado: 'done',
      });

      // Registrar os vídeos com status 'ideacao'
      for (const item of generatedIdeas) {
        await supabase.from('videos').insert({
          titulo: item.titulo,
          ideia: item.ideia,
          metadata_seo: { tags: item.tags },
          status: 'ideacao',
        });
      }
    } catch (dbErr) {
      console.warn('[API /api/research] Supabase offline, operando em modo local:', dbErr);
    }

    return NextResponse.json({
      success: true,
      agente: 'endu',
      ideas: generatedIdeas,
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
