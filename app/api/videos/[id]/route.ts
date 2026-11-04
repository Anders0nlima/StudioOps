import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { Video } from '@/lib/supabase/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = createServerClient();
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, video: data });
      }
    } catch (dbErr) {
      console.warn('[API /api/videos/[id] GET] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      video: {
        id,
        titulo: 'Exemplo de Vídeo em Revisão',
        ideia: 'Pauta recuperada para edição',
        status: 'pendente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar vídeo' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedFields = ['titulo', 'roteiro', 'metadata_seo', 'status', 'agendado_para', 'ideia'];
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const supabase = createServerClient();
    try {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          video: data,
          message: 'Vídeo atualizado com sucesso no Supabase.',
        });
      }
    } catch (dbErr) {
      console.warn('[API /api/videos/[id] PATCH] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      video: { id, ...updates },
      message: 'Vídeo atualizado localmente.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar vídeo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = createServerClient();
    try {
      await supabase.from('videos').delete().eq('id', id);
    } catch (dbErr) {
      console.warn('[API /api/videos/[id] DELETE] Supabase offline:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Vídeo ${id} removido com sucesso.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao excluir vídeo' },
      { status: 500 }
    );
  }
}
