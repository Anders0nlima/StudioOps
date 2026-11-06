-- ==============================================================================
-- StudioOps — Schema da Fila Assíncrona de IA e Renderização (Shorts & Colab GPU)
-- FASE 6 — Fila de Jobs no Supabase (Comunicação Segura sem Túnel/ngrok)
-- ==============================================================================

-- 1. Estender Tabela de Vídeos para suporte a Shorts, Renderers e Cenas
ALTER TABLE videos ADD COLUMN IF NOT EXISTS formato TEXT DEFAULT 'long'; -- 'long' | 'short'
ALTER TABLE videos ADD COLUMN IF NOT EXISTS renderer TEXT DEFAULT 'local'; -- 'local' | 'colab' | 'capcut'
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS scenes JSONB; -- [ { "ordem": 1, "texto": "...", "duracao": 3.5, "termo_visual": "...", "prompt_capcut": "..." } ]

-- 2. Tabela de Registro e Heartbeat de Workers (Colab GPU e Local)
CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,                       -- ex: 'colab-gpu-t4-01', 'local-worker-pc'
  tipo TEXT NOT NULL DEFAULT 'local',        -- 'colab' | 'local'
  gpu_name TEXT,                             -- ex: 'Tesla T4', 'NVIDIA RTX 3060'
  vram_mb INTEGER DEFAULT 0,                 -- ex: 15360 (16GB)
  status TEXT DEFAULT 'online',              -- 'online' | 'busy' | 'offline'
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Fila de Tarefas de IA (Endu, Luca, Nando)
CREATE TABLE IF NOT EXISTS ai_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL,                        -- 'research' | 'script' | 'seo' | 'metrics'
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  resultado JSONB,
  status TEXT DEFAULT 'pending',             -- 'pending' | 'processing' | 'completed' | 'failed'
  worker_id TEXT REFERENCES workers(id) ON DELETE SET NULL,
  retry_count INTEGER DEFAULT 0,
  error TEXT,
  heartbeat_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Renderização de Vídeo (FFmpeg, TTS, Whisper)
CREATE TABLE IF NOT EXISTS render_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  renderer TEXT NOT NULL DEFAULT 'local',    -- 'local' | 'colab' | 'capcut'
  status TEXT DEFAULT 'pending',             -- 'pending' | 'rendering' | 'completed' | 'failed'
  step TEXT DEFAULT 'queued',                -- 'queued' | 'tts' | 'captions' | 'visuals' | 'compose' | 'done'
  progress INTEGER DEFAULT 0,                -- 0 a 100%
  error TEXT,
  output_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Alta Performance para Polling Eficiente
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status_created ON ai_jobs(status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_workers_last_seen ON workers(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_videos_formato ON videos(formato);

-- Habilitar Supabase Realtime para a Fila de Agentes e Workers
ALTER TABLE ai_jobs REPLICA IDENTITY FULL;
ALTER TABLE workers REPLICA IDENTITY FULL;
ALTER TABLE render_jobs REPLICA IDENTITY FULL;

