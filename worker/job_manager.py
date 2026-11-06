import time
import threading
from datetime import datetime, timezone
from supabase import create_client, Client
from worker.config import (
    SUPABASE_URL,
    SUPABASE_KEY,
    WORKER_ID,
    WORKER_TYPE,
    detect_gpu,
    HEARTBEAT_INTERVAL
)

class JobManager:
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no worker.")

        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.worker_id = WORKER_ID
        self.worker_type = WORKER_TYPE
        self.gpu_name, self.vram_mb = detect_gpu()
        self._running = True
        self._heartbeat_thread = None

    def register_worker(self):
        """Registra ou atualiza o status do worker na tabela 'workers'."""
        now = datetime.now(timezone.utc).isoformat()
        data = {
            "id": self.worker_id,
            "tipo": self.worker_type,
            "gpu_name": self.gpu_name,
            "vram_mb": self.vram_mb,
            "status": "online",
            "last_seen": now,
            "meta": {
                "started_at": now,
                "gpu_detected": bool(self.gpu_name)
            }
        }
        try:
            self.supabase.table("workers").upsert(data).execute()
            print(f"[Worker] Registrado com sucesso: {self.worker_id} ({self.worker_type}) | GPU: {self.gpu_name or 'Nenhuma'} ({self.vram_mb} MB)")
        except Exception as e:
            print(f"[Worker] Alerta ao registrar worker no Supabase: {e}")

    def start_heartbeat(self):
        """Inicia thread de heartbeat periódico."""
        def _loop():
            while self._running:
                try:
                    now = datetime.now(timezone.utc).isoformat()
                    self.supabase.table("workers").update({
                        "status": "online",
                        "last_seen": now
                    }).eq("id", self.worker_id).execute()
                except Exception as err:
                    print(f"[Worker Heartbeat] Erro ao enviar pulso: {err}")
                time.sleep(HEARTBEAT_INTERVAL)

        self._heartbeat_thread = threading.Thread(target=_loop, daemon=True)
        self._heartbeat_thread.start()

    def set_status(self, status: str):
        """Atualiza status do worker ('online', 'busy', 'offline')."""
        try:
            now = datetime.now(timezone.utc).isoformat()
            self.supabase.table("workers").update({
                "status": status,
                "last_seen": now
            }).eq("id", self.worker_id).execute()
        except Exception as e:
            print(f"[Worker] Erro ao atualizar status: {e}")

    def claim_next_job(self):
        """Reivindica atomicamente a próxima tarefa pendente da fila 'ai_jobs'."""
        try:
            # Buscar o job pendente mais antigo
            response = self.supabase.table("ai_jobs") \
                .select("*") \
                .eq("status", "pending") \
                .order("created_at", desc=False) \
                .limit(1) \
                .execute()

            jobs = response.data or []
            if not jobs:
                return None

            job = jobs[0]
            job_id = job["id"]
            now = datetime.now(timezone.utc).isoformat()

            # Reivindicar atomicamente
            claim_resp = self.supabase.table("ai_jobs") \
                .update({
                    "status": "processing",
                    "worker_id": self.worker_id,
                    "heartbeat_at": now,
                    "updated_at": now
                }) \
                .eq("id", job_id) \
                .eq("status", "pending") \
                .execute()

            claimed = claim_resp.data or []
            if claimed:
                return claimed[0]
            return None
        except Exception as e:
            print(f"[Worker] Erro ao reivindicar job: {e}")
            return None

    def complete_job(self, job_id: str, resultado: dict):
        """Marca job como concluído com o payload de resultado."""
        now = datetime.now(timezone.utc).isoformat()
        try:
            self.supabase.table("ai_jobs").update({
                "status": "completed",
                "resultado": resultado,
                "updated_at": now
            }).eq("id", job_id).execute()
            print(f"[Worker] Job {job_id} concluído com sucesso!")
        except Exception as e:
            print(f"[Worker] Erro ao salvar conclusão do job {job_id}: {e}")

    def fail_job(self, job_id: str, error_msg: str):
        """Marca job como falhado e registra a mensagem de erro."""
        now = datetime.now(timezone.utc).isoformat()
        try:
            self.supabase.table("ai_jobs").update({
                "status": "failed",
                "error": error_msg,
                "updated_at": now
            }).eq("id", job_id).execute()
            print(f"[Worker] Job {job_id} marcado como falha: {error_msg}")
        except Exception as e:
            print(f"[Worker] Erro ao marcar falha do job {job_id}: {e}")

    def shutdown(self):
        """Desliga worker e marca status como offline."""
        self._running = False
        self.set_status("offline")
        print(f"[Worker] Worker {self.worker_id} desconectado graciosamente.")

