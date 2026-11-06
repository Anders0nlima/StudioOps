import { NextResponse } from 'next/server';
import { triggerScriptAndSEOAgents } from '@/lib/webhooks';
import { createServerClient } from '@/lib/supabase/server';
import { dispatchAIJob } from '@/lib/queue/ai-queue';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { video_id, ideia, titulo, formato = 'short' } = body;

    if (!video_id && !ideia) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro video_id ou ideia é obrigatório' },
        { status: 400 }
      );
    }

    // 1. Tentar gerar roteiro e cenas verticais via Fila de IA (Colab GPU ou Worker Local)
    const scriptJob = await dispatchAIJob('script', { video_id, ideia, titulo, formato }, video_id);
    const seoJob = await dispatchAIJob('seo', { video_id, titulo: titulo || ideia }, video_id);

    // 2. Chamar Webhook do n8n para manter o fluxo orquestrado
    const webhookResult = await triggerScriptAndSEOAgents({
      video_id: video_id || 'temp-id',
      ideia: ideia || titulo,
      titulo,
    });

    // 3. Cenas e roteiro (prioridade: Colab GPU / Worker -> Roteiro vertical estruturado)
    const scenes = scriptJob.resultado?.scenes || [
      {
        ordem: 1,
        texto: "Pare agora de criar vídeos manualmente. Em 2026, agentes de IA autônomos fazem tudo em 60 segundos.",
        duracao: 4.5,
        termo_visual: "futuristic AI digital robot working fast",
        prompt_capcut: "Cinematic close-up of a digital agent holographic screen glowing neon blue 9:16",
      },
      {
        ordem: 2,
        texto: "O segredo não é um único modelo genérico. Você precisa de 3 especialistas: Endu para dados, Luca para roteiro e Nando para SEO.",
        duracao: 6.0,
        termo_visual: "three glowing AI nodes network connection",
        prompt_capcut: "Three AI agent nodes connecting with high speed neon light pulses 9:16",
      },
      {
        ordem: 3,
        texto: "Quer ver essa esteira completa rodando no seu canal? Comente 'STUDIOOPS' para receber o código agora mesmo!",
        duracao: 4.5,
        termo_visual: "smartphone alert notification youtube shorts",
        prompt_capcut: "Glowing smartphone displaying incoming subscriber alert animation 9:16",
      },
    ];

    const generatedScript = scriptJob.resultado?.roteiro || scenes.map((s: any) => `[Cena ${s.ordem} - ${s.duracao}s]\n"${s.texto}"\n(Visual: ${s.termo_visual})`).join('\n\n');

    const generatedSEO = seoJob.resultado?.canais?.youtube_shorts || {
      titulo_otimizado: titulo 
        ? `${titulo} #Shorts` 
        : `Como Criar Vídeos Curtos com Agentes de IA em 60s #Shorts`,
      tags: ['Shorts', 'YouTubeShorts', 'IA', 'Automacao', 'StudioOps', 'GenAI', 'DicasTech'],
      descricao: `Aprenda como orquestrar agentes de IA autônomos (Endu, Luca, Nando) para gerar Shorts e Reels virais com supervisão humana (HITL).\n\n#Shorts #IA #Automacao`,
      justificativa_seo: 'Formatado com gancho imediato, hashtag oficial #Shorts no título e palavras-chave de alta conversão.',
    };

    const multiChannelData = seoJob.resultado?.canais || {
      youtube_shorts: generatedSEO,
      tiktok: { legenda: `${titulo || 'Automação de Conteúdo'} 🤯 #ia #tecnologia #shorts #studioops` },
      instagram_reels: { legenda: `Vídeos curtos automatizados com IA em 2026 🚀 Salve para não perder!\n#reels #ia` },
    };

    // 4. Atualizar no Supabase
    const supabase = createServerClient();
    try {
      if (video_id) {
        await supabase
          .from('videos')
          .update({
            titulo: generatedSEO.titulo_otimizado || titulo,
            roteiro: generatedScript,
            scenes,
            metadata_seo: {
              ...generatedSEO,
              multichannel: multiChannelData,
            },
            formato,
            status: 'pendente',
            updated_at: new Date().toISOString(),
          })
          .eq('id', video_id);

        const sourceLabel = scriptJob.source === 'colab_gpu' ? 'Colab GPU' : scriptJob.source === 'local_worker' ? 'Worker Local' : 'Orquestrador';

        await supabase.from('agent_logs').insert({
          agente: 'nando',
          video_id,
          mensagem: `Chefe, finalizei o SEO multicanal e o Luca concluiu o roteiro em ${scenes.length} cenas verticais via ${sourceLabel}. Aguardando sua aprovação!`,
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
      titulo_otimizado: generatedSEO.titulo_otimizado || titulo,
      roteiro: generatedScript,
      scenes,
      metadata_seo: generatedSEO,
      multichannel: multiChannelData,
      status: 'pendente',
      source: scriptJob.source,
      worker_id: scriptJob.worker_id,
      webhookSource: webhookResult.source,
      message: 'Roteiro em cenas verticais e SEO formulados. Aguardando aprovação do Chefe.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar roteiro e SEO' },
      { status: 500 }
    );
  }
}
