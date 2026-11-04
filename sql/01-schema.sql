-- ==============================================================================
-- StudioOps — Schema do Banco de Dados PostgreSQL (Supabase)
-- Suporte a Pixel Agents (Endu, Luca, Nando) e Human-in-the-Loop Pipeline
-- ==============================================================================

-- 1. Tabela de Vídeos / Roteiros
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  ideia TEXT,
  roteiro TEXT,
  metadata_seo JSONB,       -- { "tags": [], "descricao": "", "titulo_otimizado": "", "justificativa_seo": "" }
  status TEXT DEFAULT 'ideacao', -- 'ideacao' | 'pendente' | 'aprovado' | 'publicado'
  youtube_video_id TEXT,
  agendado_para TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Comentários (Analisados por IA pelo Agente Endu)
CREATE TABLE IF NOT EXISTS comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  sentimento TEXT DEFAULT 'neutro', -- 'positivo' | 'neutro' | 'negativo'
  tema TEXT,
  autor TEXT,
  data_comentario TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Métricas do Canal e de Vídeos
CREATE TABLE IF NOT EXISTS metricas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comentarios_total INTEGER DEFAULT 0,
  sentimento_positivo INTEGER DEFAULT 0,
  sentimento_negativo INTEGER DEFAULT 0,
  sentimento_neutro INTEGER DEFAULT 0,
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Logs dos Agentes (Transport Layer do Pixel Agents)
-- O frontend subscreve a esta tabela via Supabase Realtime para renderizar
-- as falas e os estados (idle, thinking, working, waiting_approval, done) ao vivo
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agente TEXT NOT NULL,      -- 'endu' | 'luca' | 'nando'
  mensagem TEXT NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  tipo TEXT DEFAULT 'info',  -- 'info' | 'success' | 'thinking' | 'error'
  estado TEXT DEFAULT 'idle', -- 'idle' | 'thinking' | 'working' | 'waiting_approval' | 'done' | 'error'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_comentarios_video_id ON comentarios(video_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agente ON agent_logs(agente);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON agent_logs(created_at DESC);

-- Habilitar Realtime para as tabelas essenciais da interface Pixel Agents
ALTER TABLE videos REPLICA IDENTITY FULL;
ALTER TABLE agent_logs REPLICA IDENTITY FULL;

