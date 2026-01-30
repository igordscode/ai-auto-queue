# Product Requirements Document (PRD) - AI Queue Master v3.0 (Autonomous Agent)

## 1. Visão do Produto
O **AI Queue Master v3.0** evolui a ferramenta de uma simples "fila de execução" para um **Agente Autônomo Recursivo**. O objetivo é permitir que o usuário defina uma meta de alto nível (ex: "Escreva um livro de 150 páginas sobre Python") e o sistema, autonomamente:
1.  Planeje a estrutura necessária (capítulos, seções).
2.  Gere os prompts de execução.
3.  Execute os prompts no ChatGPT/Gemini (usando a sessão do usuário).
4.  Valide e refine o output em tempo real.
5.  Compile o resultado final.

## 2. Problema a Resolver
Atualmente (v2.x), o usuário precisa escrever 50 prompts manualmente e colá-los na fila. Isso exige que o usuário já saiba *exatamente* como quebrar a tarefa. A v3.0 resolve a **carga cognitiva de planejamento** e a **gestão de dependências** (onde o prompt 2 depende do sucesso do prompt 1).

## 3. Arquitetura do Agente

### 3.1. Componentes
1.  **Brain (Local Server):** Python/Flask com acesso a uma LLM "inteligente" (API Key do usuário ou Ollama local). É responsável pelo planejamento e raciocínio.
2.  **Executor (Chrome Extension):** Responsável apenas por interagir com a interface do ChatGPT/Gemini (Colar, Enviar, Ler Resposta).
3.  **Bridge (Protocolo JSON):** Comunicação entre Extensão e Servidor.

### 3.2. Fluxo de Trabalho (The Loop)

#### Fase 1: Entrevista & Planejamento
1.  **Input:** Usuário digita "Criar um curso de Marketing".
2.  **Refinement:** O *Brain* analisa o pedido vago e devolve perguntas para a Extensão: "Para quem é o curso?", "Qual a duração?".
3.  **Plan:** Com as respostas, o *Brain* gera um **Plano Mestre** (Lista de Prompts encadeados) e envia para a fila da Extensão.

#### Fase 2: Execução & Recursividade
1.  **Action:** A Extensão executa o `Prompt #1` ("Gere o sumário").
2.  **Observe:** A Extensão captura a resposta do ChatGPT.
3.  **Feedback:** A Extensão envia a resposta para o *Brain*.
4.  **Evaluate:** O *Brain* analisa: "O sumário faz sentido?".
    *   *Se Sim:* Libera o `Prompt #2` ("Escreva o Modulo 1 baseado neste sumário").
    *   *Se Não:* Gera um `Prompt de Correção` ("Refaça o sumário focando em X") e insere no topo da fila.

## 4. Funcionalidades Chave

### 4.1. "Meta-Prompting"
O sistema deve ser capaz de gerar prompts para si mesmo.
*   *Exemplo:* O usuário pede um livro. O sistema gera um prompt para o ChatGPT criar o sumário. O sistema lê o sumário e gera 10 novos prompts (um para cada capítulo) dinamicamente.

### 4.2. Gestão de Contexto
Como o chat pode ficar longo, o *Brain* deve gerenciar o que é reenviado.
*   *Feature:* "Memory Injection". Antes de pedir o Capítulo 5, o sistema resume os eventos do Capítulo 4 e injeta no prompt para garantir continuidade.

### 4.3. Modos de Operação
*   **Fully Autonomous:** O sistema decide tudo.
*   **Human-in-the-Loop:** O sistema pausa antes de etapas críticas (ex: aprovar o sumário antes de gerar os capítulos) e pede confirmação ao usuário via popup da extensão.

## 5. Requisitos Técnicos
*   **Backend:** Python 3.10+, Flask/FastAPI.
*   **LLM de Controle:** Suporte a OpenAI API, Anthropic API, Google Gemini API e Ollama (Local).
*   **Storage:** Sistema de arquivos local para salvar progresso e "memória" do agente.

## 6. Roadmap de Implementação
1.  **Setup do Brain:** Criar servidor Python capaz de receber request e chamar uma API LLM.
2.  **Interface de Chat (Sidepanel):** Criar UI na extensão para conversar com o *Brain* (não com o ChatGPT).
3.  **Integração de Fila Dinâmica:** Permitir que o servidor adicione itens na fila da extensão em tempo de execução.
4.  **Loop de Feedback:** Implementar a lógica de leitura de resposta -> validação -> próxima ação.
