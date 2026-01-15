# Roadmap - AI Queue Master

## Fase 1: MVP (Completed ✅)
- [x] Estrutura básica da extensão (Manifest v3).
- [x] Injeção de painel flutuante na página.
- [x] Fila simples de texto.
- [x] Envio básico de prompts.

## Fase 2: Robustez (Current Focus 🚧)
- [ ] **Auto-Continue:** Detectar e clicar no botão de continuar automaticamente.
- [ ] **Tratamento de Erros:** Detectar se a IA travou ou deu erro de rede.
- [ ] **Refatoração:** Separar `content.js` em módulos (`ui.js`, `automator.js`).

## Fase 3: User Experience (UX)
- [ ] Edição da fila (Drag & drop, excluir item individual).
- [ ] Importação de arquivos (.txt, .csv).
- [ ] Salvar filas favoritas (Templates de 90 dias).

## Fase 4: Integração com Sistema (The "Pro" Feature)
- [ ] Criar servidor Python local.
- [ ] Comunicação WebSocket (Extensão <-> Python).
- [ ] Exportação automática de respostas para `.md` ou `.docx`.
