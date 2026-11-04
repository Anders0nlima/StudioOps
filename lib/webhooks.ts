/**
 * StudioOps — Conector de Webhooks do n8n
 * Orquestração de Agentes: Endu (Pesquisa), Luca (Roteiro) e Nando (SEO/YouTube)
 */

export const N8N_WEBHOOKS = {
  research: process.env.NEXT_PUBLIC_N8N_RESEARCH_WEBHOOK_URL || 'http://localhost:5678/webhook/pesquisar-ideias',
  generate: process.env.NEXT_PUBLIC_N8N_GENERATE_WEBHOOK_URL || 'http://localhost:5678/webhook/gerar-roteiro',
  publish: process.env.NEXT_PUBLIC_N8N_PUBLISH_WEBHOOK_URL || 'http://localhost:5678/webhook/publicar',
};

interface WebhookResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'n8n' | 'fallback_simulated';
}

/**
 * Dispara requisição HTTP com timeout e fallback caso o n8n local não esteja rodando
 */
async function callWebhook<T = any>(
  url: string,
  payload: Record<string, any>,
  timeoutMs = 6000
): Promise<WebhookResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`n8n webhook respondeu com status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      source: 'n8n',
    };
  } catch (error: any) {
    console.warn(`[StudioOps Webhooks] Falha na conexão com n8n (${url}): ${error.message}. Utilizando simulação local.`);
    return {
      success: true,
      error: error.message,
      source: 'fallback_simulated',
    };
  }
}

export async function triggerResearchAgent(payload?: { tema_foco?: string }) {
  return callWebhook(N8N_WEBHOOKS.research, {
    action: 'pesquisar_ideias',
    agente: 'endu',
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export async function triggerScriptAndSEOAgents(payload: { video_id: string; ideia: string; titulo?: string }) {
  return callWebhook(N8N_WEBHOOKS.generate, {
    action: 'gerar_roteiro_e_seo',
    agentes: ['luca', 'nando'],
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export async function triggerPublishAgent(payload: { video_id: string; schedule_date?: string }) {
  return callWebhook(N8N_WEBHOOKS.publish, {
    action: 'publicar_youtube',
    agente: 'nando',
    timestamp: new Date().toISOString(),
    ...payload,
  });
}
