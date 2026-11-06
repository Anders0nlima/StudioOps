import os
import platform
import socket
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis do .env ou .env.local se existir
root_dir = Path(__file__).resolve().parent.parent
env_local = root_dir / '.env.local'
env_file = root_dir / '.env'

if env_local.exists():
    load_dotenv(env_local)
elif env_file.exists():
    load_dotenv(env_file)
else:
    load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

# Identificação do Worker
DEFAULT_TYPE = "colab" if "COLAB_GPU" in os.environ or "google.colab" in os.environ.get("_", "") else "local"
WORKER_TYPE = os.getenv("WORKER_TYPE", DEFAULT_TYPE)

hostname = socket.gethostname()
WORKER_ID = os.getenv("WORKER_ID", f"{WORKER_TYPE}-{hostname}")

POLL_INTERVAL = float(os.getenv("POLL_INTERVAL", "2.0"))
HEARTBEAT_INTERVAL = float(os.getenv("HEARTBEAT_INTERVAL", "10.0"))

def detect_gpu():
    """Detecta disponibilidade de GPU CUDA e quantidade de VRAM."""
    gpu_name = None
    vram_mb = 0
    try:
        import torch
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            vram_mb = int(torch.cuda.get_device_properties(0).total_memory / (1024 * 1024))
    except Exception:
        pass
    
    if not gpu_name and WORKER_TYPE == "colab":
        gpu_name = "Tesla T4 (Colab)"
        vram_mb = 15360

    return gpu_name, vram_mb

