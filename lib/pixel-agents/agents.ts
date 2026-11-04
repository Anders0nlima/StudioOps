import type { AgentName } from '@/lib/supabase/types';
import type { AgentState } from './states';

export interface AgentDefinition {
  id: AgentName;
  name: string;
  role: string;
  specialty: string;
  model: string;
  provider: string;
  emoji: string;
  avatarUrl: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  defaultState: AgentState;
  catchphrase: string;
}

export const PIXEL_AGENTS: Record<AgentName, AgentDefinition> = {
  endu: {
    id: 'endu',
    name: 'Endu',
    role: 'Estrategista de Dados',
    specialty: 'Análise de Sentimento & Pautas Virais',
    model: 'Gemini 1.5 Flash',
    provider: 'Google AI',
    emoji: '📊',
    avatarUrl: '/agents/endu.svg',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgGradient: 'from-blue-950/30 via-slate-900/60 to-slate-950',
    defaultState: 'idle',
    catchphrase: 'Identifiquei padrões nos comentários que valem um novo vídeo.',
  },
  luca: {
    id: 'luca',
    name: 'Luca',
    role: 'Roteirista Criativo',
    specialty: 'Storytelling, Ganchos de Retenção & Copywriting',
    model: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    emoji: '✍️',
    avatarUrl: '/agents/luca.svg',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/30 via-slate-900/60 to-slate-950',
    defaultState: 'idle',
    catchphrase: 'Escrevi um gancho inicial que vai prender a audiência nos primeiros 15 segundos.',
  },
  nando: {
    id: 'nando',
    name: 'Nando',
    role: 'Diretor de SEO & Publicação',
    specialty: 'Títulos Otimizados, Tags & Agendamento YouTube',
    model: 'GPT-4o',
    provider: 'OpenAI',
    emoji: '🚀',
    avatarUrl: '/agents/nando.svg',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/30 via-slate-900/60 to-slate-950',
    defaultState: 'idle',
    catchphrase: 'Título e tags otimizados para máxima taxa de clique (CTR). Pronto para envio.',
  },
};

export const AGENT_LIST: AgentDefinition[] = Object.values(PIXEL_AGENTS);
