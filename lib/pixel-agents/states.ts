export type AgentState = 
  | 'idle' 
  | 'thinking' 
  | 'working' 
  | 'waiting_approval' 
  | 'done' 
  | 'error';

export interface StateConfig {
  label: string;
  badgeLabel: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowEffect: string;
  isAnimated: boolean;
  description: string;
}

export const AGENT_STATES: Record<AgentState, StateConfig> = {
  idle: {
    label: 'Pronto / Em espera',
    badgeLabel: 'Pronto',
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-900/60',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-700/60',
    glowEffect: 'ring-0',
    isAnimated: false,
    description: 'Aguardando próxima tarefa ou gatilho de pesquisa.',
  },
  thinking: {
    label: 'Processando raciocínio...',
    badgeLabel: 'Pensando',
    dotColor: 'bg-amber-400',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700/60',
    glowEffect: 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20',
    isAnimated: true,
    description: 'Analisando dados contextuais ou estruturando prompts de raciocínio.',
  },
  working: {
    label: 'Executando tarefa...',
    badgeLabel: 'Trabalhando',
    dotColor: 'bg-indigo-400',
    badgeBg: 'bg-indigo-950/60',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-700/60',
    glowEffect: 'ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/30 animate-pulse',
    isAnimated: true,
    description: 'Redigindo conteúdo, otimizando SEO ou chamando APIs externas.',
  },
  waiting_approval: {
    label: 'Aguardando decisão do Chefe',
    badgeLabel: 'Aprovação Pendente',
    dotColor: 'bg-yellow-400',
    badgeBg: 'bg-yellow-950/70',
    badgeText: 'text-yellow-300 font-bold',
    badgeBorder: 'border-yellow-600/80',
    glowEffect: 'ring-2 ring-yellow-400/80 shadow-lg shadow-yellow-500/40 animate-pulse',
    isAnimated: true,
    description: 'O roteiro e metadados estão finalizados e prontos para revisão humana.',
  },
  done: {
    label: 'Tarefa concluída com sucesso',
    badgeLabel: 'Concluído',
    dotColor: 'bg-emerald-400',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/60',
    glowEffect: 'ring-1 ring-emerald-500/40',
    isAnimated: false,
    description: 'Última ação finalizada e persistida no banco.',
  },
  error: {
    label: 'Falha na execução',
    badgeLabel: 'Erro',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-700/60',
    glowEffect: 'ring-2 ring-rose-500/60',
    isAnimated: false,
    description: 'Ocorreu um erro durante a chamada da API ou processamento da tarefa.',
  },
};
