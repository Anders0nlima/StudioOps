export type VideoStatus = 'ideacao' | 'pendente' | 'aprovado' | 'publicado';
export type VideoFormat = 'long' | 'short';
export type VideoRenderer = 'local' | 'colab' | 'capcut';

export interface SceneItem {
  ordem: number;
  texto: string;
  duracao?: number;
  termo_visual?: string;
  prompt_capcut?: string;
}

export interface VideoMetadataSEO {
  tags?: string[];
  descricao?: string;
  titulo_otimizado?: string;
  justificativa_seo?: string;
}

export interface Video {
  id: string;
  titulo: string | null;
  ideia: string | null;
  roteiro: string | null;
  metadata_seo: VideoMetadataSEO | null;
  status: VideoStatus;
  formato?: VideoFormat;
  renderer?: VideoRenderer;
  video_url?: string | null;
  scenes?: SceneItem[] | null;
  youtube_video_id: string | null;
  created_at: string;
  updated_at: string;
}

export type SentimentType = 'positivo' | 'neutro' | 'negativo';

export interface Comentario {
  id: string;
  video_id: string;
  texto: string;
  sentimento: SentimentType;
  tema: string | null;
  autor: string | null;
  data_comentario: string | null;
  created_at: string;
}

export interface Metricas {
  id: string;
  video_id: string;
  views: number;
  likes: number;
  comentarios_total: number;
  sentimento_positivo: number;
  sentimento_negativo: number;
  sentimento_neutro: number;
  atualizado_em: string;
}

export type AgentName = 'endu' | 'luca' | 'nando';
export type AgentLogType = 'info' | 'success' | 'thinking' | 'error';
export type AgentState = 'idle' | 'thinking' | 'working' | 'waiting_approval' | 'done' | 'error';

export interface AgentLog {
  id: string;
  agente: AgentName;
  mensagem: string;
  video_id?: string | null;
  tipo: AgentLogType;
  estado: AgentState;
  created_at: string;
}

export type WorkerType = 'colab' | 'local';
export type WorkerStatus = 'online' | 'busy' | 'offline';

export interface WorkerNode {
  id: string;
  tipo: WorkerType;
  gpu_name: string | null;
  vram_mb: number;
  status: WorkerStatus;
  last_seen: string;
  meta?: Record<string, any>;
  created_at: string;
}

export type AIJobType = 'research' | 'script' | 'seo' | 'metrics';
export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AIJob {
  id: string;
  tipo: AIJobType;
  video_id?: string | null;
  payload: Record<string, any>;
  resultado?: Record<string, any> | null;
  status: AIJobStatus;
  worker_id?: string | null;
  retry_count: number;
  error?: string | null;
  heartbeat_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RenderJob {
  id: string;
  video_id: string;
  renderer: VideoRenderer;
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  step: 'queued' | 'tts' | 'captions' | 'visuals' | 'compose' | 'done';
  progress: number;
  error?: string | null;
  output_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: Video;
        Insert: Partial<Omit<Video, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<Video, 'id'>>;
      };
      comentarios: {
        Row: Comentario;
        Insert: Partial<Omit<Comentario, 'id' | 'created_at'>>;
        Update: Partial<Omit<Comentario, 'id'>>;
      };
      metricas: {
        Row: Metricas;
        Insert: Partial<Omit<Metricas, 'id' | 'atualizado_em'>>;
        Update: Partial<Omit<Metricas, 'id'>>;
      };
      agent_logs: {
        Row: AgentLog;
        Insert: Partial<Omit<AgentLog, 'id' | 'created_at'>>;
        Update: Partial<Omit<AgentLog, 'id'>>;
      };
      workers: {
        Row: WorkerNode;
        Insert: Partial<Omit<WorkerNode, 'created_at'>>;
        Update: Partial<Omit<WorkerNode, 'id'>>;
      };
      ai_jobs: {
        Row: AIJob;
        Insert: Partial<Omit<AIJob, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<AIJob, 'id'>>;
      };
      render_jobs: {
        Row: RenderJob;
        Insert: Partial<Omit<RenderJob, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<RenderJob, 'id'>>;
      };
    };
  };
}

