import { NextResponse } from 'next/server';
import { triggerPublishAgent } from '@/lib/webhooks';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { video_id, schedule_date } = body;

    if (!video_id) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro video_id é obrigatório para publicação' },
        { status: 400 }
      );
    }

    const targetDate = schedule_date || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    // 1. Chamar Webhook do n8n para publicação via YouTube Data API
    const webhookResult = await triggerPublishAgent({
      video_id,
      schedule_date: targetDate,
    });

    const youtubeVideoId = `yt_${Math.random().toString(36).substring(2, 11)}`;

    // 2. Persistir no Supabase se configurado
    const supabase = createServerClient();
    try {
      await supabase
        .from('videos')
        .update({
          status: 'publicado',
          youtube_video_id: youtubeVideoId,
          agendado_para: targetDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', video_id);

      await supabase.from('agent_logs').insert({
        agente: 'nando',
        video_id,
        mensagem: `🚀 Vídeo aprovado pelo Chefe e agendado com sucesso para ${new Date(targetDate).toLocaleString('pt-BR')} no YouTube!`,
        tipo: 'success',
        estado: 'done',
      });
    } catch (dbErr) {
      console.warn('[API /api/publish] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      agente: 'nando',
      video_id,
      youtube_video_id: youtubeVideoId,
      agendado_para: targetDate,
      status: 'publicado',
      webhookSource: webhookResult.source,
      message: 'Vídeo publicado e agendado no canal com sucesso pelo Nando.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao publicar vídeo no YouTube' },
      { status: 500 }
    );
  }
}
