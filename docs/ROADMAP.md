# Roadmap - Queue Master PRO

## Fase 1: MVP (Concluído ✅)
- [x] Estrutura básica da extensão (Manifest v3).
- [x] Painel flutuante injetado.
- [x] Fila sequencial simples.

## Fase 2: Estabilidade & UX (Concluído ✅)
- [x] **Auto-Continue:** Clicar em "Continuar gerando" automaticamente.
- [x] **Bulk Import:** Colar lista de prompts.
- [x] **Smart Monitoring:** Correção de bugs de pular itens (Fix v2.0).
- [x] **UI Polish:** Botões de minimizar, limpar e status visual.

## Fase 3: Integração de Sistema (Concluído ✅)
- [x] Servidor Python Local (Flask).
- [x] Auto-Save de respostas em arquivos locais.
- [x] Documentação Comercial (README v2.0).

## Fase 4: Advanced AI Orchestration (Próximo 🚀)
- [ ] **Dynamic Branching:** O servidor lê a resposta da IA e decide qual o próximo prompt (usando uma API leve local ou remota).
- [ ] **Retry Logic:** Se a IA der erro de rede, tentar recarregar a página e reenviar o último prompt.
- [ ] **Multi-Tab Support:** Rodar filas diferentes em abas diferentes simultaneamente.
- [ ] **Export to Notion/Google Docs:** Integração direta via API em vez de apenas arquivos locais.

## Fase 5: Monetização & Distribuição
- [ ] Empacotar instalador único (Exe) para o servidor Python.
- [ ] Publicar na Chrome Web Store.
