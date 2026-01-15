# Product Requirements Document (PRD) - AI Queue Master

## 1. Visão Geral
O **AI Queue Master** é uma extensão de navegador e conjunto de scripts projetados para profissionais de marketing e engenheiros de prompt que precisam executar fluxos de trabalho longos e sequenciais em LLMs (ChatGPT, Gemini, Claude) sem interrupções manuais.

**Problema:** A criação de planos de longo prazo (ex: 90 dias de conteúdo) exige múltiplos prompts sequenciais. O usuário precisa esperar cada resposta, copiar o próximo prompt, colar e clicar em "continuar" repetidamente.

**Solução:** Uma ferramenta que gerencia uma fila de prompts, detecta o estado da interface da IA e executa as ações automaticamente, incluindo clicar em "Continuar Gerando" se a resposta for cortada.

## 2. Objetivos
*   Eliminar a intervenção manual durante a execução de uma sequência de prompts.
*   Permitir a importação de grandes volumes de prompts (Bulk).
*   Garantir a integridade das respostas longas (Auto-continue).
*   Futuro: Integrar com sistema de arquivos local para salvar respostas automaticamente.

## 3. Especificações Funcionais (Features)

### 3.1. Gerenciamento de Fila (Core)
*   **Input:** Área de texto para colar múltiplos prompts.
*   **Separador:** Detecção inteligente de quebras de linha duplas como separadores de prompts.
*   **Visualização:** Lista visual dos itens na fila (Pendente, Em Progresso, Concluído).
*   **Controle:** Botões Play, Pause, Limpar e Editar Item.

### 3.2. Automação de Interface (The Clicker)
*   **Injeção de Texto:** Inserir texto nos campos `textarea` (ChatGPT) e `contenteditable` (Gemini) simulando eventos de teclado reais.
*   **Detecção de Ociosidade:** Monitorar o botão "Stop Generating" ou "Send" para saber quando a IA terminou.
*   **Auto-Continue:** Se o botão "Continue Generating" aparecer, clicar automaticamente sem avançar a fila de prompts.

### 3.3. Configurações (Settings)
*   Delay entre prompts (para evitar rate limits).
*   Seleção do seletor CSS (caso a interface das IAs mude).

## 4. Requisitos Não-Funcionais
*   **Performance:** A extensão não deve deixar o navegador lento.
*   **Privacidade:** Nenhum dado é enviado para servidores externos (além da própria IA que o usuário já está usando). Tudo roda localmente.
*   **Compatibilidade:** Google Chrome (Chromium-based).

## 5. Arquitetura (Visão Alto Nível)
*   **Frontend (Extension):** HTML/CSS/JS injetado via Content Script.
*   **Backend (Future):** Python Flask Server rodando em `localhost:5000` para operações de sistema de arquivos (File I/O).
