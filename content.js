// Variáveis de Estado
let promptQueue = [];
let currentIndex = 0;
let isPanelMinimized = false;
let autoAdvance = false;
let isProcessing = false;
let sessionLog = "";

const ICONS = {
    load: `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`,
    clear: `<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4v-2zm0-4h4v2h-4v-2zm0-4h4v2h-4V8zM5 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H5v10zm10-12H5V4c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2z"/></svg>`,
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    download: `<svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>`,
    delete: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    minimize: `<svg viewBox="0 0 24 24"><path d="M6 19h12v2H6v-2z"/></svg>`,
    maximize: `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`
};

// 1. Criar e Injetar a Interface (UI)
function createInterface() {
  if (document.getElementById('ai-queue-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'ai-queue-panel';
  panel.innerHTML = `
    <div id="ai-queue-header">
      <span>QUEUE MASTER PRO</span>
      <div style="display:flex; gap:10px; align-items:center;">
        <button id="btn-minimize" class="btn-item-del" style="color: #aaa;">${ICONS.minimize}</button>
      </div>
    </div>
    <div id="panel-content">
      <textarea id="ai-queue-input" placeholder="Cole seus prompts aqui... (Cada bloco separado por linha vazia será um item da fila)"></textarea>

      <input type="text" id="session-name" class="qm-input" placeholder="Nome do arquivo (ex: Meu_Livro)">

      <div class="queue-controls">
        <button id="btn-load" class="queue-btn">${ICONS.load} Carregar</button>
        <button id="btn-clear" class="queue-btn">${ICONS.clear} Limpar</button>
      </div>

      <div class="auto-advance-row">
        <input type="checkbox" id="chk-auto-advance">
        <label for="chk-auto-advance">Auto-avançar & Compilar Log</label>
      </div>

      <div id="queue-status" class="status-bar">Fila vazia</div>

      <div style="display:flex; gap:5px; margin-top:5px;">
        <button id="btn-next" class="queue-btn" disabled style="flex:1;">${ICONS.play} Iniciar</button>
        <button id="btn-download-log" class="queue-btn" style="flex:1;" title="Baixar histórico atual">${ICONS.download} Salvar</button>
      </div>

      <div id="queue-list-container" style="max-height: 200px; overflow-y: auto; margin-top: 10px;">      
        <div id="queue-list"></div>
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
  document.getElementById('chk-auto-advance').addEventListener('change', (e) => {
    autoAdvance = e.target.checked;
  });
  
  document.getElementById('session-name').addEventListener('input', (e) => {
      localStorage.setItem('qm_session_name', e.target.value);
  });
}

// 2. Funções da Interface
function toggleMinimize() {
  const panel = document.getElementById('ai-queue-panel');
  const content = document.getElementById('panel-content');
  const btn = document.getElementById('btn-minimize');
  isPanelMinimized = !isPanelMinimized;

  if (isPanelMinimized) {
    panel.classList.add('minimized');
    btn.innerHTML = ICONS.maximize;
    content.style.display = 'none';
  } else {
    panel.classList.remove('minimized');
    btn.innerHTML = ICONS.minimize;
    content.style.display = 'flex';
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
  if (currentIndex >= promptQueue.length && promptQueue.length > 0) currentIndex = promptQueue.length - 1;

  renderQueueList();
  updateStatus();
  updateNextButtonText();
}

function clearQueue() {
  if (confirm("Limpar toda a fila e o histórico de log?")) {
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
  if (promptQueue.length === 0) {
    status.textContent = "Fila vazia";
  } else {
    status.textContent = `${currentIndex} de ${promptQueue.length} concluídos`;
  }
}

function updateNextButtonText() {
  const btn = document.getElementById('btn-next');
  if (currentIndex < promptQueue.length) {
    btn.innerHTML = `${ICONS.play} Enviar Prompt ${currentIndex + 1}`;
    btn.disabled = isProcessing;
  } else {
    btn.innerHTML = `Concluído`;
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
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteItem(index);
    };

    item.appendChild(text);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

// 3. Automação de Site (Mantido)
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
  const continueBtn = buttons.find(btn =>
    btn.textContent.toLowerCase().includes('continue generating') ||
    btn.textContent.toLowerCase().includes('continuar gerando')
  );

  if (continueBtn) {
    continueBtn.click();
    return true;
  }
  return false;
}

function isGenerating() {
  const stopBtn = document.querySelector('button[aria-label="Stop generating"]') ||
                  document.querySelector('button[data-testid="stop-button"]') ||
                  document.querySelector('button[aria-label="Stop"]');
  return !!stopBtn;
}

function sendNextPrompt(manualClick = false) {
  if (currentIndex >= promptQueue.length || isProcessing) return;

  const inputEl = getChatInput();
  if (!inputEl) {
    alert("Caixa de entrada não encontrada!");
    return;
  }

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
    const textNode = document.createTextNode(promptText);
    inputEl.appendChild(textNode);
    range.selectNodeContents(inputEl);
    selection.removeAllRanges();
    selection.addRange(range);
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  setTimeout(() => {
    const btn = getSendButton();
    if (btn) btn.click();
    else {
      const enter = new KeyboardEvent('keydown', { bubbles:true, cancelable:true, keyCode:13, key:'Enter' });
      inputEl.dispatchEvent(enter);
    }
    updateStatusDisplay("⏳ Processando...");
    monitorResponse();
  }, 600);
}

function updateStatusDisplay(msg) {
  document.getElementById('queue-status').textContent = msg;
}

// 4. Lógica de Log
function appendToLog(prompt, content) {
    const entry = `\n## Item ${currentIndex + 1}\n**Prompt:**\n${prompt}\n\n**Resposta:**\n${content}\n\n---\n`;
    sessionLog += entry;
    localStorage.setItem('qm_session_log', sessionLog);
}

function downloadFullLog(manual = false) {
    if (!sessionLog) {
        if(manual) alert("Nada para salvar!");
        return;
    }
    let userFilename = document.getElementById('session-name').value.trim().replace(/[^a-z0-9_\-\s]/gi, '_');
    const filename = userFilename ? `${userFilename}.md` : `QueueMaster-Log-${Date.now()}.md`;
    const blob = new Blob([`# Queue Master Log\n\n${sessionLog}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    updateStatusDisplay(`📂 Salvo: ${filename}`);
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
            updateStatusDisplay("🚀 Próximo em 3s...");
            setTimeout(() => sendNextPrompt(), 3000);
          } else if (currentIndex >= promptQueue.length) {
            downloadFullLog();
          }
        } else {
          monitorResponse();
        }
      }, 2000);
    }
  }, 1000);
}

createInterface();
setInterval(createInterface, 3000);
