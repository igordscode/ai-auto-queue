// Variáveis de Estado
let promptQueue = [];
let currentIndex = 0;
let isPanelMinimized = false;
let autoAdvance = false;
let isProcessing = false;
let sessionLog = "";

// Sistema de Tradução
const TRANSLATIONS = {
    'pt': {
        title: "QUEUE MASTER PRO",
        placeholder: "Cole seus prompts aqui... (Cada bloco separado por linha vazia será um item da fila)",
        filenamePlaceholder: "Nome do arquivo (ex: Meu_Livro)",
        load: "Carregar",
        clear: "Limpar",
        autoAdvance: "Auto-avançar & Compilar Log",
        emptyQueue: "Fila vazia",
        start: "Iniciar",
        save: "Salvar",
        sendNext: "Enviar Prompt",
        done: "Concluído",
        processing: "⏳ Processando...",
        autoContinue: "🔄 Auto-Continue...",
        saved: "📂 Salvo:",
        confirmClear: "Limpar toda a fila e o histórico de log?",
        noInput: "Caixa de entrada não encontrada!",
        nothingToSave: "Nada para salvar!",
        nextIn: "🚀 Próximo em 3s...",
        finalizing: "🎉 Finalizado! Baixando...",
        itemDone: "✅ Item Concluído (Pausado)",
        itemRegistered: "📝 Item"
    },
    'en': {
        title: "QUEUE MASTER PRO",
        placeholder: "Paste your prompts here... (Separate blocks with empty lines)",
        filenamePlaceholder: "Filename (e.g., My_Book)",
        load: "Load",
        clear: "Clear",
        autoAdvance: "Auto-advance & Compile Log",
        emptyQueue: "Queue empty",
        start: "Start",
        save: "Save",
        sendNext: "Send Prompt",
        done: "Done",
        processing: "⏳ Processing...",
        autoContinue: "🔄 Auto-Continue...",
        saved: "📂 Saved:",
        confirmClear: "Clear entire queue and history?",
        noInput: "Input box not found!",
        nothingToSave: "Nothing to save!",
        nextIn: "🚀 Next in 3s...",
        finalizing: "🎉 Finished! Downloading...",
        itemDone: "✅ Item Done (Paused)",
        itemRegistered: "📝 Item"
    },
    'es': {
        title: "QUEUE MASTER PRO",
        placeholder: "Pega tus prompts aquí... (Separa bloques con líneas vacías)",
        filenamePlaceholder: "Nombre del archivo (ej: Mi_Libro)",
        load: "Cargar",
        clear: "Limpiar",
        autoAdvance: "Auto-avanzar y Compilar Log",
        emptyQueue: "Cola vacía",
        start: "Iniciar",
        save: "Guardar",
        sendNext: "Enviar Prompt",
        done: "Hecho",
        processing: "⏳ Procesando...",
        autoContinue: "🔄 Auto-Continuar...",
        saved: "📂 Guardado:",
        confirmClear: "¿Limpiar toda la cola y el historial?",
        noInput: "¡Cuadro de entrada no encontrado!",
        nothingToSave: "¡Nada que guardar!",
        nextIn: "🚀 Siguiente en 3s...",
        finalizing: "🎉 ¡Finalizado! Descargando...",
        itemDone: "✅ Ítem Terminado (Pausado)",
        itemRegistered: "📝 Ítem"
    },
    'fr': {
        title: "QUEUE MASTER PRO",
        placeholder: "Collez vos prompts ici... (Séparez les blocs par des lignes vides)",
        filenamePlaceholder: "Nom du fichier (ex: Mon_Livre)",
        load: "Charger",
        clear: "Effacer",
        autoAdvance: "Avance auto & Compil. Log",
        emptyQueue: "File vide",
        start: "Démarrer",
        save: "Sauver",
        sendNext: "Envoyer Prompt",
        done: "Terminé",
        processing: "⏳ Traitement...",
        autoContinue: "🔄 Auto-Continue...",
        saved: "📂 Sauvegardé:",
        confirmClear: "Tout effacer ?",
        noInput: "Zone de texte introuvable !",
        nothingToSave: "Rien à sauver !",
        nextIn: "🚀 Suivant dans 3s...",
        finalizing: "🎉 Terminé ! Téléchargement...",
        itemDone: "✅ Item Terminé (Pause)",
        itemRegistered: "📝 Item"
    },
    'de': {
        title: "QUEUE MASTER PRO",
        placeholder: "Fügen Sie Ihre Prompts hier ein... (Blöcke durch Leerzeilen trennen)",
        filenamePlaceholder: "Dateiname (z.B. Mein_Buch)",
        load: "Laden",
        clear: "Leeren",
        autoAdvance: "Auto-Weiter & Log kompilieren",
        emptyQueue: "Warteschlange leer",
        start: "Starten",
        save: "Speichern",
        sendNext: "Senden Prompt",
        done: "Fertig",
        processing: "⏳ Verarbeite...",
        autoContinue: "🔄 Auto-Fortsetzen...",
        saved: "📂 Gespeichert:",
        confirmClear: "Alles löschen?",
        noInput: "Eingabefeld nicht gefunden!",
        nothingToSave: "Nichts zu speichern!",
        nextIn: "🚀 Nächster in 3s...",
        finalizing: "🎉 Fertig! Herunterladen...",
        itemDone: "✅ Element Fertig (Pausiert)",
        itemRegistered: "📝 Element"
    },
    'zh': {
        title: "QUEUE MASTER PRO",
        placeholder: "在此粘贴您的提示...（用空行分隔块）",
        filenamePlaceholder: "文件名（例如：我的书）",
        load: "加载",
        clear: "清除",
        autoAdvance: "自动推进 & 编译日志",
        emptyQueue: "队列为空",
        start: "开始",
        save: "保存",
        sendNext: "发送提示",
        done: "完成",
        processing: "⏳ 处理中...",
        autoContinue: "🔄 自动继续...",
        saved: "📂 已保存:",
        confirmClear: "清除整个队列和历史记录？",
        noInput: "未找到输入框！",
        nothingToSave: "没有可保存的内容！",
        nextIn: "🚀 3秒后下一个...",
        finalizing: "🎉 完成！正在下载...",
        itemDone: "✅ 项目完成（暂停）",
        itemRegistered: "📝 项目"
    }
};

// Detectar idioma (Padrão: Inglês)
const userLang = navigator.language.split('-')[0];
const lang = TRANSLATIONS[userLang] || TRANSLATIONS['en'];

const ICONS = {
    load: `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`,
    clear: `<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V8zM5 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H5v10zm10-12H5V4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2z"/></svg>`,
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    download: `<svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>`,
    delete: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    minimize: `<svg viewBox="0 0 24 24"><path d="M6 19h12v2H6v-2z"/></svg>`,
    maximize: `<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM11 7h2v10h-2V7zM7 11h10v2H7v-2z"/></svg>`
};

function createInterface() {
  if (document.getElementById('ai-queue-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'ai-queue-panel';
  panel.innerHTML = `
    <div id="ai-queue-header">
      <span>${lang.title}</span>
      <button id="btn-minimize" title="Minimizar/Maximizar" style="background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;">
        ${ICONS.minimize}
      </button>
    </div>
    <div id="panel-content">
      <textarea id="ai-queue-input" placeholder="${lang.placeholder}"></textarea>
      <input type="text" id="session-name" class="qm-input" placeholder="${lang.filenamePlaceholder}">
      <div class="queue-controls">
        <button id="btn-load" class="queue-btn">${ICONS.load} ${lang.load}</button>
        <button id="btn-clear" class="queue-btn">${ICONS.clear} ${lang.clear}</button>
      </div>
      <div class="auto-advance-row">
        <input type="checkbox" id="chk-auto-advance">
        <label for="chk-auto-advance">${lang.autoAdvance}</label>
      </div>
      <div id="queue-status" class="status-bar">${lang.emptyQueue}</div>
      <div style="display:flex; gap:5px; margin-top:5px;">
        <button id="btn-next" class="queue-btn" disabled style="flex:1;">${ICONS.play} ${lang.start}</button>
        <button id="btn-download-log" class="queue-btn" style="flex:1;">${ICONS.download} ${lang.save}</button>
      </div>
            <div id="queue-list-container" style="max-height: 200px; overflow-y: auto; margin-top: 10px;">      
        <div id="queue-list"></div>
      </div>
      <div id="ai-queue-footer">
        <a href="https://github.com/igordscode/ai-auto-queue" target="_blank" title="Visit GitHub Repo">
          Made by igordscode ☕
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const savedLog = localStorage.getItem('qm_session_log');
  if (savedLog) sessionLog = savedLog;
  const savedName = localStorage.getItem('qm_session_name');
  if (savedName) document.getElementById('session-name').value = savedName;

  document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('btn-load').addEventListener('click', loadQueue);
  document.getElementById('btn-clear').addEventListener('click', clearQueue);
  document.getElementById('btn-next').addEventListener('click', () => sendNextPrompt(true));
  document.getElementById('btn-download-log').addEventListener('click', () => downloadFullLog(true));
  document.getElementById('chk-auto-advance').addEventListener('change', (e) => autoAdvance = e.target.checked);
  document.getElementById('session-name').addEventListener('input', (e) => localStorage.setItem('qm_session_name', e.target.value));
}

function toggleMinimize() {
  const panel = document.getElementById('ai-queue-panel');
  const btn = document.getElementById('btn-minimize');
  isPanelMinimized = !isPanelMinimized;
  if (isPanelMinimized) {
    panel.classList.add('minimized');
    btn.innerHTML = ICONS.play;
  } else {
    panel.classList.remove('minimized');
    btn.innerHTML = ICONS.minimize;
  }
}

function loadQueue() {
  const text = document.getElementById('ai-queue-input').value;
  if (!text.trim()) return;
  const newPrompts = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p !== '');
  promptQueue = [...promptQueue, ...newPrompts];
  updateStatus();
  renderQueueList();
  updateNextButtonText();
}

function deleteItem(index) {
  promptQueue.splice(index, 1);
  if (currentIndex > index) currentIndex--;
  renderQueueList();
  updateStatus();
  updateNextButtonText();
}

function clearQueue() {
  if (confirm(lang.confirmClear)) {
    promptQueue = [];
    currentIndex = 0;
    sessionLog = "";
    localStorage.removeItem('qm_session_log');
    renderQueueList();
    updateStatus();
    document.getElementById('btn-next').disabled = true;
    isProcessing = false;
  }
}

function updateStatus() {
  const status = document.getElementById('queue-status');
  status.textContent = promptQueue.length === 0 ? lang.emptyQueue : `${currentIndex} / ${promptQueue.length} ${lang.done}`;
}

function updateNextButtonText() {
  const btn = document.getElementById('btn-next');
  if (currentIndex < promptQueue.length) {
    btn.innerHTML = `${ICONS.play} ${lang.sendNext} ${currentIndex + 1}`;
    btn.disabled = isProcessing;
  } else {
    btn.innerHTML = lang.done;
    btn.disabled = true;
  }
}

function renderQueueList() {
  const list = document.getElementById('queue-list');
  list.innerHTML = '';
  promptQueue.forEach((prompt, index) => {
    const item = document.createElement('div');
    item.className = `queue-item ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'done' : ''}`;
    const text = document.createElement('span');
    text.textContent = `${index + 1}. ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}`;      
    const delBtn = document.createElement('button');
    delBtn.className = 'btn-item-del';
    delBtn.innerHTML = ICONS.delete;
    delBtn.onclick = (e) => { e.stopPropagation(); deleteItem(index); };
    item.appendChild(text);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

function getChatInput() {
  return document.querySelector('#prompt-textarea') ||
         document.querySelector('div[contenteditable="true"].ql-editor') ||
         document.querySelector('rich-textarea div[contenteditable="true"]') ||
         document.querySelector('div[contenteditable="true"]');
}

function getSendButton() {
  return document.querySelector('button[data-testid="send-button"]') ||
         document.querySelector('button[aria-label*="Send"]') ||
         document.querySelector('.send-button');
}

function checkAutoContinue() {
  const buttons = Array.from(document.querySelectorAll('button'));
  const continueBtn = buttons.find(btn => btn.textContent.toLowerCase().includes('continue generating') || btn.textContent.toLowerCase().includes('continuar gerando'));
  if (continueBtn) { continueBtn.click(); return true; }
  return false;
}

function isGenerating() {
  const stopBtn = document.querySelector('button[aria-label="Stop generating"]') || document.querySelector('button[data-testid="stop-button"]') || document.querySelector('button[aria-label="Stop"]');
  return !!stopBtn;
}

function sendNextPrompt(manualClick = false) {
  if (currentIndex >= promptQueue.length || isProcessing) return;
  const inputEl = getChatInput();
  if (!inputEl) { alert(lang.noInput); return; }
  isProcessing = true;
  updateNextButtonText();
  const promptText = promptQueue[currentIndex];
  inputEl.focus();
  if (inputEl.tagName === 'TEXTAREA') {
    inputEl.value = promptText;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    const selection = window.getSelection();
    const range = document.createRange();
    inputEl.innerHTML = '';
    inputEl.appendChild(document.createTextNode(promptText));
    range.selectNodeContents(inputEl);
    selection.removeAllRanges();
    selection.addRange(range);
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  }
  setTimeout(() => {
    const btn = getSendButton();
    if (btn) btn.click();
    else { inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles:true, cancelable:true, keyCode:13, key:'Enter' })); }
    updateStatusDisplay(lang.processing);
    monitorResponse();
  }, 600);
}

function updateStatusDisplay(msg) { document.getElementById('queue-status').textContent = msg; }

function appendToLog(prompt, content) {
    sessionLog += `\n## ${lang.itemRegistered} ${currentIndex + 1}\n**Prompt:**\n${prompt}\n\n**Resposta:**\n${content}\n\n---\n`;
    localStorage.setItem('qm_session_log', sessionLog);
}

function downloadFullLog(manual = false) {
    if (!sessionLog) { if(manual) alert(lang.nothingToSave); return; }
    let userFilename = document.getElementById('session-name').value.trim().replace(/[^a-z0-9_\-\s]/gi, '_');
    const filename = userFilename ? `${userFilename}.md` : `QueueMaster-Log-${Date.now()}.md`;
    const blob = new Blob([`# Queue Master Log\n\n${sessionLog}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    updateStatusDisplay(`${lang.saved} ${filename}`);
}

function captureLastResponse() {
  const responses = document.querySelectorAll('.markdown, .model-response-text, .message-content');       
  return responses.length > 0 ? responses[responses.length - 1].innerText : null;
}

function monitorResponse() {
  if (window.monitorInterval) clearInterval(window.monitorInterval);
  window.monitorInterval = setInterval(() => {
    if (checkAutoContinue()) return;
    if (!isGenerating()) {
      clearInterval(window.monitorInterval);
      setTimeout(() => {
        if (!isGenerating() && !checkAutoContinue()) {
          const responseText = captureLastResponse();
          if (responseText) appendToLog(promptQueue[currentIndex], responseText);
          currentIndex++;
          isProcessing = false;
          updateStatus();
          renderQueueList();
          updateNextButtonText();
          if (autoAdvance && currentIndex < promptQueue.length) {
            updateStatusDisplay(lang.nextIn);
            setTimeout(() => sendNextPrompt(), 3000);
          } else if (currentIndex >= promptQueue.length) {
            updateStatusDisplay(lang.finalizing);
            downloadFullLog();
          }
        } else { monitorResponse(); }
      }, 2000);
    }
  }, 1000);
}

createInterface();
setInterval(createInterface, 3000);

