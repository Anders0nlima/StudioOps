import { createServerClient } from '@/lib/supabase/server';
import { AIJobType, WorkerNode } from '@/lib/supabase/types';

export interface DispatchJobResult {
  source: 'colab_gpu' | 'local_worker' | 'fallback_resilient';
  job_id?: string;
  worker_id?: string;
  resultado: any;
  message: string;
}

/**
 * Despacha uma tarefa para a fila de IA no Supabase.
 * Se houver um worker ativo (Colab GPU ou Local), aguarda o processamento em tempo real.
 * Caso contrário, executa o fallback inteligente de forma resiliente.
 */
export async function dispatchAIJob(
  tipo: AIJobType,
  payload: Record<string, any>,
  videoId?: string,
  timeoutMs: number = 7000
): Promise<DispatchJobResult> {
  const supabase = createServerClient();

  try {
    // 1. Verificar se há algum Worker Online (último heartbeat nos últimos 45s)
    const thresholdDate = new Date(Date.now() - 45 * 1000).toISOString();
    const { data: activeWorkers } = await supabase
      .from('workers')
      .select('*')
      .eq('status', 'online')
      .gte('last_seen', thresholdDate)
      .order('last_seen', { ascending: false });

    const hasOnlineWorker = activeWorkers && activeWorkers.length > 0;
    const bestWorker = hasOnlineWorker ? (activeWorkers[0] as WorkerNode) : null;

    // 2. Inserir a tarefa na fila 'ai_jobs'
    const { data: jobData, error: insertErr } = await supabase
      .from('ai_jobs')
      .insert({
        tipo,
        video_id: videoId || null,
        payload,
        status: 'pending',
      })
      .select()
      .single();

    if (insertErr || !jobData) {
      console.warn('[AI Queue] Supabase ai_jobs offline, usando fallback:', insertErr?.message);
      return {
        source: 'fallback_resilient',
        resultado: null,
        message: 'Fila offline. Operando em modo de resiliência local.',
      };
    }

    const jobId = jobData.id;

    // 3. Se houver worker online, aguardar resposta via polling rápido
    if (hasOnlineWorker) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeoutMs) {
        await new Promise((res) => setTimeout(res, 500));

        const { data: checkJob } = await supabase
          .from('ai_jobs')
          .select('status, resultado, worker_id')
          .eq('id', jobId)
          .single();

        if (checkJob && checkJob.status === 'completed' && checkJob.resultado) {
          const isColab = bestWorker?.tipo === 'colab' || checkJob.worker_id?.includes('colab');
          return {
            source: isColab ? 'colab_gpu' : 'local_worker',
            job_id: jobId,
            worker_id: checkJob.worker_id,
            resultado: checkJob.resultado,
            message: `Processado com sucesso pelo worker ${checkJob.worker_id}.`,
          };
        }

        if (checkJob && checkJob.status === 'failed') {
          break;
        }
      }
    }

    // 4. Se não houver worker ou o timeout for atingido, retorna com job_id para processamento assíncrono
    return {
      source: 'fallback_resilient',
      job_id: jobId,
      resultado: null,
      message: hasOnlineWorker
        ? 'Tarefa enfileirada. Worker ocupado, resultado será entregue via Realtime.'
        : 'Nenhum worker ativo no momento. Tarefa salva na fila pendente.',
    };
  } catch (err: any) {
    console.warn('[AI Queue] Erro ao despachar tarefa:', err?.message);
    return {
      source: 'fallback_resilient',
      resultado: null,
      message: 'Operando em modo de resiliência local.',
    };
  }
}

/**
 * Consulta a lista de workers cadastrados e verifica quem está online.
 */
export async function getWorkersOverview() {
  const supabase = createServerClient();
  try {
    const thresholdDate = new Date(Date.now() - 45 * 1000).toISOString();
    const { data: workers } = await supabase
      .from('workers')
      .select('*')
      .order('last_seen', { ascending: false });

    const list = (workers || []) as WorkerNode[];
    const onlineWorkers = list.filter(
      (w) => w.status === 'online' && new Date(w.last_seen) >= new Date(thresholdDate)
    );

    const colabWorker = onlineWorkers.find((w) => w.tipo === 'colab');
    const localWorker = onlineWorkers.find((w) => w.tipo === 'local');

    return {
      total: list.length,
      onlineCount: onlineWorkers.length,
      colabOnline: !!colabWorker,
      localOnline: !!localWorker,
      primaryWorker: colabWorker || localWorker || null,
      workers: list,
    };
  } catch {
    return {
      total: 0,
      onlineCount: 0,
      colabOnline: false,
      localOnline: false,
      primaryWorker: null,
      workers: [],
    };
  }
}

