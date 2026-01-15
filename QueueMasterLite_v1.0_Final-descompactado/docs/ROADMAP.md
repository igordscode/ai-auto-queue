# Roadmap - AI Queue Master

## Fase 1: MVP (Concluído ✅)
- [x] Estrutura básica da extensão (Manifest v3).
- [x] Injeção de painel flutuante na página.
- [x] Fila simples de texto.
- [x] Envio básico de prompts.

## Fase 2: Robustez (Concluído ✅)
- [x] **Auto-Continue:** Detectar e clicar no botão de continuar automaticamente.
- [x] Monitoramento de estado da IA (Gerando/Parado).
- [x] Reconexão automática da interface (SPA navigation support).

## Fase 3: User Experience (Concluído ✅)
- [x] Painel Minimzável.
- [x] Excluir itens individuais da fila.
- [x] Bulk Import (Colar lista com quebra de linha inteligente).
- [x] **Auto-Advance:** Checkbox para enviar o próximo prompt automaticamente.

## Fase 4: Integração com Sistema (Em Progresso 🚧)
- [x] Criar servidor Python local (Flask).
- [x] Comunicação HTTP (Extensão -> Python).
- [x] Salvamento automático de respostas em Markdown (`.md`).
- [ ] Integração com n8n/Webhook (Enviar JSON para automação externa).

## Fase 5: Modo Agente / AI Orchestrator (Novo 🔮)
*Transformar a extensão em um Agente Autônomo.*
- [ ] **Prompt Dinâmico:** O servidor Python recebe a resposta da IA, processa (usando uma API da OpenAI/Gemini) e gera o próximo prompt da fila baseado no contexto.
- [ ] **Modo "Debate":** Configurar duas personas (ex: ChatGPT no Chrome e Gemini na API) para debaterem um tópico até chegarem a uma conclusão.
- [ ] **Meta-Prompts:** O usuário define apenas o "Objetivo Final" (ex: "Crie um curso completo de Python") e o Agente quebra isso em 50 prompts automaticamente.
