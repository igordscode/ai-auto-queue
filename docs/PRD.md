# Product Requirements Document (PRD) - Queue Master Series

## 1. Estratégia de Produto
O projeto foi dividido em duas camadas para reduzir a fricção de entrada e criar um funil de vendas:

### A. Queue Master LITE (Versão Atual)
*   **Target:** Usuários comuns, produtores de conteúdo.
*   **Arquitetura:** Standalone (Apenas Extensão).
*   **Diferencial:** Zero setup. Salva arquivos via API de Download do navegador.

### B. Queue Master AGENT/PRO (Futuro)
*   **Target:** Power users, desenvolvedores, empresas.
*   **Arquitetura:** Híbrida (Extensão + Python Backend).
*   **Diferencial:** Orquestração dinâmica, conexão com APIs externas, lógica de decisão baseada em contexto.

## 2. Especificações (LITE)
*   **Queue Management:** Fila de prompts injetada no DOM.
*   **Smart Monitoring:** Monitoramento de botões de status da IA.
*   **Native Saving:** Download automático de arquivos .md para a pasta Downloads do usuário.

## 3. Roadmmap Simplificado
- [x] LITE: Standalone extension.
- [x] LITE: Bug fixes (pular itens).
- [ ] AGENT: Início do desenvolvimento da lógica de decisão.
