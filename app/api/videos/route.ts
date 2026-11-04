import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { Video, VideoStatus } from '@/lib/supabase/types';

// Dados base de demonstração
const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    titulo: 'Como Criar um Canal Dark no YouTube com IA em 2026',
    ideia: 'Tutorial passo a passo ensinando a criar vídeos sem aparecer usando IA gratuita',
    roteiro: `[INTRO - 0:00]\n"Se você acha que precisa gastar milhares de reais com câmeras e microfones para ter um canal rentável no YouTube em 2026, você está perdendo tempo. Hoje, uma pessoa sozinha usando três ferramentas gratuitas consegue gerar conteúdos com qualidade de estúdio."\n\n[BLOCO 1 - 1:15]\n"A primeira etapa é a pesquisa de tópicos virais. É aqui que o Gemini se destaca..."\n\n[BLOCO 2 - 3:45]\n"Para a narrativa e roteiro, o Claude 3.5 Sonnet entrega uma retenção 40% superior..."\n\n[CTA FINAL - 7:30]\n"Se você quer a lista completa dos prompts que usamos, deixe seu like e comente 'PROMPTS' abaixo!"`,
    metadata_seo: {
      tags: ['ia', 'youtube-dark', 'renda-extra', 'inteligencia-artificial', 'tutoriais'],
      descricao: 'Descubra como criar um canal dark no YouTube usando apenas ferramentas de inteligência artificial gratuitas.',
      titulo_otimizado: 'Como Criar um Canal Dark no YouTube com IA em 2026 (Passo a Passo)',
    },
    status: 'pendente',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'vid-2',
    titulo: '5 Ferramentas de IA Pouco Conhecidas que Superam o ChatGPT',
    ideia: 'Comparativo prático de ferramentas de nicho para criadores de conteúdo',
    roteiro: null,
    metadata_seo: {
      tags: ['chatgpt', 'ferramentas-ia', 'produtividade'],
    },
    status: 'ideacao',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'vid-3',
    titulo: 'Quanto o YouTube Pagou por 100.000 Visualizações?',
    ideia: 'Abertura de métricas reais de RPM e CPM de vídeos de tecnologia',
    roteiro: 'Roteiro validado e aprovado pelo Chefe.',
    metadata_seo: {
      tags: ['monetizacao', 'cpm-youtube', 'financas'],
      titulo_otimizado: 'Quanto o YouTube Me Pagou por 100 Mil Views? (Valores Reais Revelados)',
    },
    status: 'aprovado',
    youtube_video_id: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'vid-4',
    titulo: 'Como Automatizar Seus Vídeos com n8n e IA',
    ideia: 'Tutorial de automação completa com webhook e agentes',
    roteiro: 'Roteiro publicado.',
    metadata_seo: {
      tags: ['n8n', 'automacao', 'youtube-api'],
      titulo_otimizado: 'Automação Completa de YouTube com n8n e Agentes de IA',
    },
    status: 'publicado',
    youtube_video_id: 'dQw4w9WgXcQ',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as VideoStatus | null;
    const search = searchParams.get('search')?.toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));

    const supabase = createServerClient();
    try {
      let query = supabase.from('videos').select('*', { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`titulo.ilike.%${search}%,ideia.ilike.%${search}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          success: true,
          videos: data as Video[],
          total: count || data.length,
          page,
          totalPages: Math.ceil((count || data.length) / limit),
        });
      }
    } catch (dbErr) {
      console.warn('[API /api/videos] Supabase fallback para memória:', dbErr);
    }

    // Filtrar dados em memória caso Supabase não esteja conectado
    let filtered = [...FALLBACK_VIDEOS];
    if (status) {
      filtered = filtered.filter((v) => v.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (v) =>
          v.titulo?.toLowerCase().includes(search) ||
          v.ideia?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      videos: filtered,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao listar vídeos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, ideia, tags } = body;

    if (!titulo && !ideia) {
      return NextResponse.json(
        { success: false, error: 'Título ou ideia é obrigatório' },
        { status: 400 }
      );
    }

    const newVideo: Partial<Video> = {
      titulo: titulo || ideia,
      ideia,
      metadata_seo: { tags: tags || [] },
      status: 'ideacao',
    };

    const supabase = createServerClient();
    try {
      const { data, error } = await supabase.from('videos').insert(newVideo).select().single();
      if (!error && data) {
        return NextResponse.json({ success: true, video: data });
      }
    } catch (dbErr) {
      console.warn('[API /api/videos POST] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      video: {
        id: `vid-${Date.now()}`,
        ...newVideo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar vídeo' },
      { status: 500 }
    );
  }
}
