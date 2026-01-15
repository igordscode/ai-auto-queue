# Product Requirements Document (PRD) - Queue Master PRO

## 1. Visão Geral
O **Queue Master PRO** é uma extensão de navegador profissional projetada para automatizar fluxos de trabalho sequenciais em LLMs (ChatGPT, Gemini, etc.). Ela permite que engenheiros de prompt e criadores de conteúdo executem filas massivas de instruções sem supervisão constante.

**Versão Atual:** 2.0 (PRO)
**Status:** Produção / Estável

## 2. Objetivos Principais
*   **Autonomia Total:** O usuário deve poder carregar 50+ prompts e sair da frente do computador.
*   **Confiabilidade:** O sistema não pode pular itens ou parar prematuramente.
*   **Persistência:** As respostas geradas devem ser salvas automaticamente para uso posterior.
*   **Universalidade:** Funcionar nas principais interfaces de Chat AI baseadas em web.

## 3. Especificações Funcionais

### 3.1. Core: Gerenciamento de Fila
*   **Bulk Loader:** Área de texto que aceita blocos de texto separados por linha vazia.
*   **Edição em Tempo Real:** Capacidade de adicionar, remover ou limpar itens mesmo durante a execução.
*   **Queue Status:** Indicadores visuais claros (Pendente, Processando, Concluído).

### 3.2. Automation Engine ("The Clicker")
*   **Smart Input:** Injeção de texto que simula digitação humana e eventos de DOM.
*   **State Detection:** Algoritmo robusto para detectar se a IA está "Pensando", "Escrevendo" ou "Parada".
*   **Anti-Race Condition:** Trava lógica (`isProcessing`) para impedir envios duplos.
*   **Auto-Continue:** Detecção automática de botões de continuação para respostas longas.

### 3.3. File System Integration (Local Server)
*   **Server:** Script Python (Flask) rodando em background.
*   **Capture:** A extensão captura o último bloco de resposta HTML/Markdown.
*   **Save:** Salva arquivos `.md` ou `.txt` em pastas organizadas com timestamp.

## 4. Arquitetura
*   **Extension (Client):** JavaScript (Vanilla) injetado via Content Script.
*   **Server (Host):** Python Flask.
*   **Comunicação:** Fetch API (HTTP POST) para `localhost:5000`.

## 5. Próximos Passos (Futuro)
*   Ver `ROADMAP.md` e `BACKLOG.md`.
