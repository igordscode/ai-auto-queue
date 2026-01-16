# Product Requirements Document (PRD) - AI Prompt Queue Master

## 1. Visão do Produto
O **AI Prompt Queue Master** é uma ferramenta de produtividade "Plug & Play" para profissionais que usam IA generativa em escala. Diferente de scripts simples, ele oferece uma experiência de usuário (UX) robusta, segura e internacionalizada.

**Status Atual:** v2.2 (Estável)
**Arquitetura:** Standalone Chrome Extension (No-Backend).

## 2. Pilares de Valor
1.  **Zero Fricção:** Instalar e usar. Sem config de servidor ou API keys.
2.  **Confiabilidade:** Algoritmos de detecção de estado garantem que a fila nunca trave ou pule itens.
3.  **Organização:** O usuário entra com caos (50 prompts soltos) e sai com ordem (1 arquivo Markdown formatado).

## 3. Funcionalidades Core (v2.x)
*   **Bulk Loader:** Entrada de texto massiva.
*   **Auto-Advance:** Navegação automática com delay de segurança.
*   **Smart Auto-Save:** Compilação de sessão em arquivo único (.md).
*   **i18n Engine:** Detecção automática de idioma do navegador.
*   **UI Resiliente:** Painel flutuante não-intrusivo com minimização inteligente.

## 4. Próximos Passos (Planejamento v3.0)
*   **Melhoria de Edição:** Transição de "Lista Estática" para "Cards Interativos" (Editáveis/Reordenáveis).
*   **Multimodalidade:** Capacidade de processar imagens.
*   **Cross-Platform:** Suporte oficial para Claude e Perplexity.

## 5. Métricas de Sucesso
*   Taxa de conclusão de filas longas (>10 itens) sem erros.
*   Downloads realizados com sucesso.
*   Feedback de usabilidade da UI (minimizar/maximizar).
