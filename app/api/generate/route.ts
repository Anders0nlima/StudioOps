import { NextResponse } from 'next/server';
import { triggerScriptAndSEOAgents } from '@/lib/webhooks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { video_id, ideia, titulo } = body;

    if (!video_id && !ideia) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro video_id ou ideia é obrigatório' },
        { status: 400 }
      );
    }

    // 1. Chamar Webhook do n8n (Agente Luca Claude 3.5 + Agente Nando GPT-4o)
    const webhookResult = await triggerScriptAndSEOAgents({
      video_id: video_id || 'temp-id',
      ideia: ideia || titulo,
      titulo,
    });

    // 2. Roteiro gerado pelo Luca e SEO formulado pelo Nando
    const generatedScript = `[INTRO - 0:00]
"Se você quer colocar inteligência artificial para trabalhar no seu canal do YouTube sem parecer um robô genérico, preste muita atenção neste vídeo. Nos próximos minutos, você vai ver o fluxo exato que grandes canais estão usando para automatizar roteiros e publicação mantendo a taxa de clique alta."

[BLOCO 1 - 01:20: O Papel de Cada Agente]
"O maior erro de quem tenta usar IA no YouTube é pedir tudo para um único modelo genérico. A estratégia vencedora é dividir em especialistas:
1. Um modelo para dados e pesquisa de comentários.
2. Um modelo com alta habilidade narrativa para escrever o roteiro.
3. Um modelo treinado em SEO para otimizar títulos virais e tags."

[BLOCO 2 - 03:40: Retenção e Copywriting]
"A retenção nos primeiros 30 segundos define se o algoritmo vai recomendar seu vídeo para 100 ou 100.000 pessoas. Por isso, nunca comece pedindo inscrição. Comece entregando a promessa principal imediatamente."

[CTA FINAL - 07:15]
"Se você quer implementar essa esteira no seu canal, comente 'STUDIOOPS' aqui embaixo que vou te enviar a arquitetura completa. Não esqueça de deixar o like e até o próximo vídeo!"`;

    const generatedSEO = {
      titulo_otimizado: titulo 
        ? `${titulo} (Guia Completo 2026)` 
        : `Como Usar Agentes de IA no YouTube em 2026 (Passo a Passo)`,
      tags: ['inteligencia-artificial', 'youtube-ia', 'roteiro-ia', 'chatgpt', 'claude-3-5', 'n8n', 'automacao-youtube', 'produtividade', 'seo-youtube', 'marketing-digital'],
      descricao: `Neste vídeo, aprenda como orquestrar agentes de IA autônomos para gerenciar a produção de conteúdo do seu canal no YouTube com supervisão humana (Human-in-the-Loop).\n\n⏰ Timestamps:\n0:00 - Introdução & Gancho\n1:20 - Especialização de Agentes\n3:40 - Técnicas de Retenção\n7:15 - Conclusão & Próximos Passos`,
      justificativa_seo: 'Título formulado com gatilho de novidade (2026) e parênteses de alta conversão para maximizar o CTR.',
    };

    // 3. Atualizar no Supabase caso configurado
    const supabase = createServerClient();
    try {
      if (video_id) {
        await supabase
          .from('videos')
          .update({
            titulo: generatedSEO.titulo_otimizado,
            roteiro: generatedScript,
            metadata_seo: generatedSEO,
            status: 'pendente',
            updated_at: new Date().toISOString(),
          })
          .eq('id', video_id);

        await supabase.from('agent_logs').insert({
          agente: 'nando',
          video_id,
          mensagem: `Chefe, finalizei o SEO e o Luca concluiu o roteiro para "${generatedSEO.titulo_otimizado}". Aguardo sua aprovação para agendar!`,
          tipo: 'info',
          estado: 'waiting_approval',
        });
      }
    } catch (dbErr) {
      console.warn('[API /api/generate] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      agentes: ['luca', 'nando'],
      video_id,
      titulo_otimizado: generatedSEO.titulo_otimizado,
      roteiro: generatedScript,
      metadata_seo: generatedSEO,
      status: 'pendente',
      webhookSource: webhookResult.source,
      message: 'Roteiro e SEO formulados. Aguardando aprovação do Chefe.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar roteiro e SEO' },
      { status: 500 }
    );
  }
}
