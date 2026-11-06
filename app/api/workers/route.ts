import { NextResponse } from 'next/server';
import { getWorkersOverview } from '@/lib/queue/ai-queue';

export async function GET() {
  try {
    const overview = await getWorkersOverview();
    return NextResponse.json({
      success: true,
      ...overview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao consultar status dos workers' },
      { status: 500 }
    );
  }
}

