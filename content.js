// Variáveis de Estado
let promptQueue = [];
let currentIndex = 0;
let isPanelMinimized = false;
let autoAdvance = false;
let isProcessing = false;
let sessionLog = ""; // Acumulador de texto

// 1. Criar e Injetar a Interface (UI)
function createInterface() {
  if (document.getElementById('ai-queue-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'ai-queue-panel';
  panel.innerHTML = `
    <div id="ai-queue-header">
      <span>Queue Master LITE 🚀</span>
      <div style="display:flex; gap:10px; align-items:center;">
        <button id="btn-minimize" style="background:none; border:none; color:#aaa; cursor:pointer;">_</button>
      </div>
    </div>
    <div id="panel-content">
      <textarea id="ai-queue-input" placeholder="Cole seus prompts aqui... (Cada bloco separado por linha vazia será um item da fila)"></textarea>

      <input type="text" id="session-name" class="qm-input" placeholder="Nome do Arquivo (Opcional) - Ex: Meu_Livro">

      <div class="queue-controls">
        <button id="btn-load" class="queue-btn">📥 Carregar</button>
        <button id="btn-clear" class="queue-btn">🧹 Limpar</button>
      </div>

      <div class="auto-advance-row">
        <input type="checkbox" id="chk-auto-advance">
        <label for="chk-auto-advance">Auto-avançar & Compilar Log</label>
      </div>

      <div id="queue-status" class="status-bar">Fila vazia</div>

      <div style="display:flex; gap:5px; margin-top:5px;">
        <button id="btn-next" class="queue-btn" disabled style="flex:1;">▶ Iniciar</button>
        <button id="btn-download-log" class="queue-btn" style="flex:1; background:#2196F3;" title="Baixar histórico atual">💾 Baixar</button>
      </div>

      <div id="queue-list-container" style="max-height: 200px; overflow-y: auto; margin-top: 10px;">      
        <div id="queue-list"></div>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Restore session if exists
  const savedLog = localStorage.getItem('qm_session_log');
  if (savedLog) {
      sessionLog = savedLog;
  }
  
  // Restore filename if exists
  const savedName = localStorage.getItem('qm_session_name');
  if (savedName) {
      document.getElementById('session-name').value = savedName;
  }

  // Event Listeners
  document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('btn-load').addEventListener('click', loadQueue);
  document.getElementById('btn-clear').addEventListener('click', clearQueue);
  document.getElementById('btn-next').addEventListener('click', () => sendNextPrompt(true));
  document.getElementById('btn-download-log').addEventListener('click', () => downloadFullLog(true));
  document.getElementById('chk-auto-advance').addEventListener('change', (e) => {
    autoAdvance = e.target.checked;
  });
  
  // Save filename on change
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
    btn.textContent = '□';
    content.style.display = 'none';
  } else {
    panel.classList.remove('minimized');
    btn.textContent = '_';
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
    btn.textContent = `▶ Enviar Prompt ${currentIndex + 1}`;
    btn.disabled = isProcessing;
  } else {
    btn.textContent = "✅ Fila Finalizada";
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
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteItem(index);
    };

    item.appendChild(text);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

// 3. Automação de Site
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
    console.log("Queue Master: Clicando em 'Continuar'...");
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
  if (currentIndex >= promptQueue.length) return;
  if (isProcessing) return; 

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

// 4. Lógica de Log Unificado
function appendToLog(prompt, content) {
    const entry = `
## Item ${currentIndex + 1}
**Prompt:**
${prompt}

**Resposta:**
${content}

---
`;
    sessionLog += entry;
    // Salva no LocalStorage para segurança contra crash
    localStorage.setItem('qm_session_log', sessionLog);
    console.log("Log updated");
}

function downloadFullLog(manual = false) {
    if (!sessionLog) {
        if(manual) alert("Nada para salvar ainda!");
        return;
    }

    // 1. Pega o nome customizado
    let userFilename = document.getElementById('session-name').value.trim();
    
    // 2. Sanitiza o nome (remove caracteres inválidos de arquivo)
    userFilename = userFilename.replace(/[^a-z0-9_\-\s]/gi, '_');

    // 3. Define nome final
    let filename;
    if (userFilename) {
        filename = `${userFilename}.md`;
    } else {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        filename = `QueueMaster-Session-${timestamp}.md`;
    }

    const header = `# Queue Master Log\nArquivo: ${filename}\nData: ${new Date().toLocaleString()}\n\n---\n`;
    
    const blob = new Blob([header + sessionLog], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateStatusDisplay(`📂 Salvo: ${filename}`);
}

function captureLastResponse() {
  const responses = document.querySelectorAll('.markdown, .model-response-text, .message-content');       
  if (responses.length > 0) {
    const lastResponse = responses[responses.length - 1];
    return lastResponse.innerText;
  }
  return null;
}

function monitorResponse() {
  if (window.monitorInterval) clearInterval(window.monitorInterval);

  window.monitorInterval = setInterval(() => {
    if (checkAutoContinue()) {
      updateStatusDisplay("🔄 Auto-Continue...");
      return;
    }

    if (!isGenerating()) {
      clearInterval(window.monitorInterval);

      setTimeout(() => {
        if (!isGenerating() && !checkAutoContinue()) {
          const responseText = captureLastResponse();
          if (responseText) {
             // Em vez de baixar direto, adiciona ao log acumulado
             appendToLog(promptQueue[currentIndex], responseText);
             updateStatusDisplay(`📝 Item ${currentIndex + 1} registrado.`);
          }

          currentIndex++;
          isProcessing = false;
          
          updateStatus();
          renderQueueList();
          updateNextButtonText();

          if (autoAdvance && currentIndex < promptQueue.length) {
            updateStatusDisplay("🚀 Próximo em 3s...");
            setTimeout(() => sendNextPrompt(), 3000);
          } else {
             // Se acabou a fila ou o auto-advance está desligado
             if (currentIndex >= promptQueue.length) {
                 updateStatusDisplay("🎉 Finalizado! Baixando...");
                 downloadFullLog(); // Baixa com o nome customizado
             } else {
                 updateStatusDisplay("✅ Item Concluído (Pausado)");
             }
          }
        } else {
          updateStatusDisplay("⏳ Processando...");
          monitorResponse();
        }
      }, 2000);
    }
  }, 1000);
}

createInterface();
setInterval(createInterface, 3000);
