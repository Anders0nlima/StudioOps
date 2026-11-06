import time
import signal
import sys
from worker.config import POLL_INTERVAL
from worker.job_manager import JobManager

def process_job(job: dict) -> dict:
    """
    Processador base de jobs da fila de IA.
    Executa a tarefa de acordo com o tipo (research, script, seo).
    """
    tipo = job.get("tipo")
    payload = job.get("payload") or {}
    print(f"[Worker] Processando job tipo: '{tipo}' | ID: {job.get('id')}")

    if tipo == "research":
        tema = payload.get("tema_foco", "Inteligência Artificial no YouTube")
        # Simulação inteligente estruturada para teste do pipeline de fila
        return {
            "agente": "endu",
            "ideas": [
                {
                    "titulo": f"Como Dominar {tema} em 60 Segundos",
                    "ideia": f"Pauta de alta retenção no formato Shorts explorando as maiores oportunidades em {tema}.",
                    "tags": ["shorts", "ia", "produtividade", "automacao"],
                    "formato": "short"
                },
                {
                    "titulo": f"3 Segredos de {tema} que Ninguém Te Conta",
                    "ideia": f"Shorts dinâmico de curiosidades técnicas com gancho nos 3 primeiros segundos.",
                    "tags": ["curiosidades", "dicas-rapidas", "shorts-viral"],
                    "formato": "short"
                }
            ],
            "message": f"Endu processou a pesquisa sobre '{tema}' com sucesso na GPU/Worker."
        }

    elif tipo == "script":
        ideia = payload.get("ideia", "")
        titulo = payload.get("titulo", "Shorts Viral")
        return {
            "agente": "luca",
            "titulo": titulo,
            "scenes": [
                {
                    "ordem": 1,
                    "texto": "Pare agora de perder tempo criando vídeos manualmente. Em 2026, agentes de IA fazem tudo em segundos.",
                    "duracao": 4.5,
                    "termo_visual": "futuristic AI robot working fast",
                    "prompt_capcut": "Cinematic close-up of a digital agent holographic screen"
                },
                {
                    "ordem": 2,
                    "texto": "O segredo não é usar apenas um modelo. Você precisa de três especialistas: um para pautas, outro para roteiro e outro para SEO.",
                    "duracao": 6.0,
                    "termo_visual": "three glowing AI connected nodes network",
                    "prompt_capcut": "Three AI nodes connecting with high speed neon light pulses"
                },
                {
                    "ordem": 3,
                    "texto": "Quer a esteira completa no seu canal? Comente 'STUDIOOPS' e receba o código agora mesmo!",
                    "duracao": 4.0,
                    "termo_visual": "smartphone screen notification youtube shorts",
                    "prompt_capcut": "Glowing smartphone showing incoming subscriber alert"
                }
            ],
            "message": "Luca concluiu a roteirização em cenas verticais 9:16 com gancho de alta retenção."
        }

    elif tipo == "seo":
        titulo = payload.get("titulo", "Vídeo de IA")
        return {
            "agente": "nando",
            "canais": {
                "youtube_shorts": {
                    "titulo": f"{titulo} #Shorts",
                    "descricao": "Aprenda a orquestrar agentes de IA autônomos para YouTube Shorts com StudioOps.",
                    "tags": ["Shorts", "IA", "YouTubeAutomation", "Tech"]
                },
                "tiktok": {
                    "legenda": f"Você ainda cria vídeos na mão? Olha isso 🤯 #ia #tecnologia #dicas #shorts #studioops"
                },
                "instagram_reels": {
                    "legenda": f"Automação de conteúdo com IA em 2026. Salve para não perder! 🚀\n.\n.\n#reels #inteligenciaartificial #produtividade #marketingdigital"
                }
            },
            "message": "Nando adaptou os metadados de SEO para YouTube Shorts, TikTok e Instagram Reels."
        }

    else:
        return {
            "status": "echo",
            "payload_recebido": payload,
            "mensagem": f"Job tipo '{tipo}' processado pelo worker."
        }

def main():
    print("=" * 60)
    print(" StudioOps — Worker de IA & Processamento (Queue Consumer)")
    print("=" * 60)

    try:
        manager = JobManager()
    except Exception as err:
        print(f"[Worker Erro Fatal] {err}")
        sys.exit(1)

    manager.register_worker()
    manager.start_heartbeat()

    def signal_handler(sig, frame):
        print("\n[Worker] Sinal de parada recebido. Encerrando...")
        manager.shutdown()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    print(f"[Worker] Escutando fila 'ai_jobs' a cada {POLL_INTERVAL}s... Pressione Ctrl+C para parar.")

    while True:
        try:
            job = manager.claim_next_job()
            if job:
                job_id = job["id"]
                manager.set_status("busy")
                try:
                    resultado = process_job(job)
                    manager.complete_job(job_id, resultado)
                except Exception as proc_err:
                    manager.fail_job(job_id, str(proc_err))
                finally:
                    manager.set_status("online")
            else:
                time.sleep(POLL_INTERVAL)
        except Exception as loop_err:
            print(f"[Worker Loop Erro] {loop_err}")
            time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()

