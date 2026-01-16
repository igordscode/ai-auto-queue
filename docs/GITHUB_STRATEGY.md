# 🧠 Estratégia GitHub & Autoridade - Igor Da Silva

Este documento centraliza a estratégia de construção de portfólio e autoridade técnica. O objetivo não é apenas "ter commits", mas construir uma narrativa de **AI Product Builder**.

---

## 📅 Roadmap de 30 Dias (AI Dev Utilities)

### ✅ Semana 1: Fundação (Concluído)
- **Projeto:** `repo-context-generator`
- **O que é:** CLI que lê um repo e gera um `context.md` para LLMs.
- **Status:** Publicado.

### 🔜 Semana 2: Utilidade Prática
- **Projeto:** `ai-commit-writer`
- **Conceito:** CLI que lê o `git diff` staged, manda pro Gemini/OpenAI e sugere uma mensagem de commit seguindo o padrão Conventional Commits.
- **Por que:** Todo dev odeia escrever commit message. Ferramenta de alta utilidade.

### 🗓️ Semana 3: Automação & Webhooks
- **Projeto:** `webhook-to-ai` (Micro-SaaS Open Core)
- **Conceito:** Um endpoint simples (Express/FastAPI) que recebe um webhook, passa o payload para uma IA com um prompt, e devolve a resposta estruturada.
- **Caso de uso:** Conectar Typeform direto no GPT sem usar Zapier caro.

### 🗓️ Semana 4: Consolidação
- **Projeto:** `ai-dev-utils` (Monorepo)
- **Conceito:** Juntar as ferramentas anteriores em uma biblioteca única ou criar uma documentação unificada. Foco em polimento e READMEs perfeitos.

---

## 🎥 Estratégia de Conteúdo (Queue Master)

### 📹 O Vídeo Demo (30 a 60s)
**Objetivo:** Mostrar valor rápido sem falar "techniquês".

**Roteiro Sugerido:**
1.  **O Problema (5s):** Mostre você colando um prompt, esperando a IA, copiando, colando o próximo. Texto na tela: *"Cansado de ser babá de IA?"*
2.  **A Solução (10s):** Abra o Queue Master. Cole 5 prompts de uma vez. Clique em "Start".
3.  **A Mágica (10s):** Acelere o vídeo (2x ou 4x) mostrando a extensão trabalhando sozinha, rolando a tela e clicando em "Continuar".
4.  **O Resultado (5s):** Mostre a pasta Downloads com o arquivo `.md` pronto.
5.  **CTA (Final):** "Baixe grátis no GitHub. Link na bio."

### 📝 Posts para LinkedIn/Twitter
**Headline:** "Construí uma ferramenta para automatizar meu próprio trabalho e liberei o código."
**Corpo:**
- Explique que você precisava rodar 50 prompts para um projeto.
- Fez na mão e odiou.
- Criou uma extensão em JS puro para resolver.
- Agora ela tem fila, auto-save e roda local.
- "Se quiser testar, o código tá aqui: [Link]"

---

## 💡 Ideias de Projetos Futuros (Backlog)

### 1. Automation as Code
- **`n8n-workflow-registry`:** Um repo só com JSONs de workflows úteis do n8n que você criou.
- **`form-to-agent`:** Script que lê respostas de Google Sheets e dispara agentes de IA.

### 2. Micro SaaS (Open Core)
- **`agent-router`:** Uma lib que recebe uma pergunta e decide se manda pro GPT-4 (caro/inteligente) ou GPT-3.5/Gemini Flash (barato/rápido) baseado na complexidade.
- **`prompt-budget`:** CLI que lê seus arquivos de prompt e estima quanto vai custar rodar aquilo na API da OpenAI.

---

## 🛡️ Regra de Ouro (Projetos Privados)
Se não pode ser público:
1. Crie uma versão "Lite" open-source.
2. Mesmo conceito, sem a lógica de negócio sensível.
3. Isso mantém seu gráfico verde e mostra que você sabe fazer, sem vazar segredo industrial.
