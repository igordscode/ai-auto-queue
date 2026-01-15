// Variáveis de Estado
let promptQueue = [];
let currentIndex = 0;
let isPanelMinimized = false;
let autoAdvance = false;

// 1. Criar e Injetar a Interface (UI)
function createInterface() {
  if (document.getElementById('ai-queue-panel')) return;

  const panel = document.createElement('div');
  panel.id = 'ai-queue-panel';
  panel.innerHTML = `
    <div id="ai-queue-header">
      <span>Queue Master Lite 🤖</span>
      <button id="btn-minimize" style="background:none; border:none; color:#aaa; cursor:pointer;">_</button>
    </div>
    <div id="panel-content">
      <textarea id="ai-queue-input" placeholder="Cole seus prompts aqui... (Separe blocos com linha vazia)"></textarea>
      
      <div class="queue-controls">
        <button id="btn-load" class="queue-btn">📥 Carregar</button>
        <button id="btn-clear" class="queue-btn">🧹 Limpar</button>
      </div>

      <div class="auto-advance-row">
        <input type="checkbox" id="chk-auto-advance">
        <label for="chk-auto-advance">Auto-avançar (Cuidado! 🔥)</label>
      </div>

      <div id="queue-status" class="status-bar">Fila vazia</div>
      
      <button id="btn-next" class="queue-btn" disabled>▶ Enviar Próximo</button>
      
      <div id="queue-list-container" style="max-height: 180px; overflow-y: auto; margin-top: 10px;">
        <div id="queue-list"></div>
      </div>
    </div>
    <div id="ai-queue-footer">
      <span>By <b>igordscode</b></span>
      <a href="https://www.buymeacoffee.com/igordscode" target="_blank">☕ Buy me a coffee</a>
    </div>
  `;

  document.body.appendChild(panel);

  // Event Listeners
  document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('btn-load').addEventListener('click', loadQueue);
  document.getElementById('btn-clear').addEventListener('click', clearQueue);
  document.getElementById('btn-next').addEventListener('click', () => sendNextPrompt(manualClick = true));
  document.getElementById('chk-auto-advance').addEventListener('change', (e) => {
    autoAdvance = e.target.checked;
  });
}

// 2. Funções da Interface
function toggleMinimize() {
  const panel = document.getElementById('ai-queue-panel');
  const content = document.getElementById('panel-content');
  const footer = document.getElementById('ai-queue-footer');
  const btn = document.getElementById('btn-minimize');
  isPanelMinimized = !isPanelMinimized;
  
  if (isPanelMinimized) {
    panel.classList.add('minimized');
    btn.textContent = '▢';
    content.style.display = 'none';
    footer.style.display = 'none';
  } else {
    panel.classList.remove('minimized');
    btn.textContent = '_';
    content.style.display = 'flex';
    footer.style.display = 'flex';
  }
}

function loadQueue() {
  const text = document.getElementById('ai-queue-input').value;
  if (!text.trim()) return;

  const newPrompts = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p !== '');
  promptQueue = [...promptQueue, ...newPrompts];
  
  updateStatus();
  renderQueueList();
  
  document.getElementById('btn-next').disabled = false;
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
  if (confirm("Limpar toda a fila?")) {
    promptQueue = [];
    currentIndex = 0;
    renderQueueList();
    updateStatus();
    document.getElementById('btn-next').disabled = true;
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
    btn.disabled = false;
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

  const inputEl = getChatInput();
  if (!inputEl) {
    alert("Caixa de entrada não encontrada!");
    return;
  }

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

function monitorResponse() {
  const check = setInterval(() => {
    if (checkAutoContinue()) {
      updateStatusDisplay("🔄 Auto-Continue...");
      return;
    }

    if (!isGenerating()) {
      setTimeout(() => {
        if (!isGenerating() && !checkAutoContinue()) {
          clearInterval(check);
          
          currentIndex++;
          updateStatus();
          renderQueueList();
          updateNextButtonText();
          
          if (autoAdvance && currentIndex < promptQueue.length) {
            updateStatusDisplay("🚀 Próximo em 3s...");
            setTimeout(() => sendNextPrompt(), 3000);
          } else if (!autoAdvance) {
            updateStatusDisplay("✅ Concluído");
          }
        }
      }, 2000);
    }
  }, 2000);
}

createInterface();
setInterval(createInterface, 3000);
