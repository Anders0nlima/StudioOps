@echo off
set N8N_USER_FOLDER=%~dp0.n8n_data
echo ===================================================
echo  Iniciando n8n (StudioOps Local Orchestrator)
echo  Dados salvos em: %N8N_USER_FOLDER%
echo  Acesse em: http://localhost:5678
echo ===================================================
n8n start

