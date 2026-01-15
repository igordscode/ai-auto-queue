// Variáveis de Estado
let promptQueue = [];
let currentIndex = 0;
let isPanelMinimized = false;

// 1. Criar e Injetar a Interface (UI)
function createInterface() {
  const panel = document.createElement('div');
  panel.id = 'ai-queue-panel';
  panel.innerHTML = `
    <div id="ai-queue-header">
      <span>Queue Master 🤖</span>
      <button id="btn-minimize">_</button>
    </div>
    <div id="panel-content">
      <textarea id="ai-queue-input" placeholder="Cole seus prompts aqui.
Separe-os por uma linha vazia."></textarea>
      <div class="queue-controls">
        <button id="btn-load" class="queue-btn">Carregar Fila</button>
        <button id="btn-clear" class="queue-btn">Limpar</button>
      </div>
      <div id="queue-status" class="status-bar">Fila vazia</div>
      <div class="queue-controls" style="margin-top: 10px;">
        <button id="btn-next" class="queue-btn" disabled>▶ Enviar Próximo</button>
      </div>
      <div id="queue-list" style="max-height: 150px; overflow-y: auto; margin-top: 10px;"></div>
    </div>
  `;

  document.body.appendChild(panel);

  // Adicionar Event Listeners
  document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('btn-load').addEventListener('click', loadQueue);
  document.getElementById('btn-clear').addEventListener('click', clearQueue);
  document.getElementById('btn-next').addEventListener('click', sendNextPrompt);
}

// 2. Funções da Interface
function toggleMinimize() {
  const panel = document.getElementById('ai-queue-panel');
  const content = document.getElementById('panel-content');
  const btn = document.getElementById('btn-minimize');
  
  isPanelMinimized = !isPanelMinimized;
  
  if (isPanelMinimized) {
    panel.classList.add('minimized');
    btn.textContent = '+';
    content.style.display = 'none';
  } else {
    panel.classList.remove('minimized');
    btn.textContent = '_';
    content.style.display = 'block';
  }
}

function loadQueue() {
  const text = document.getElementById('ai-queue-input').value;
  if (!text.trim()) return;

  // Separar por linhas duplas (blocos de texto)
  promptQueue = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
  currentIndex = 0;
  
  updateStatus();
  renderQueueList();
  
  document.getElementById('btn-next').disabled = false;
  document.getElementById('btn-next').textContent = `▶ Enviar Próximo (1/${promptQueue.length})`;
}

function clearQueue() {
  promptQueue = [];
  currentIndex = 0;
  document.getElementById('ai-queue-input').value = '';
  document.getElementById('queue-list').innerHTML = '';
  updateStatus();
  document.getElementById('btn-next').disabled = true;
  document.getElementById('btn-next').textContent = "▶ Enviar Próximo";
}

function updateStatus() {
  const status = document.getElementById('queue-status');
  if (promptQueue.length === 0) {
    status.textContent = "Fila vazia";
  } else {
    status.textContent = `${currentIndex} concluídos de ${promptQueue.length}`;
  }
}

function renderQueueList() {
  const list = document.getElementById('queue-list');
  list.innerHTML = '';
  
  promptQueue.forEach((prompt, index) => {
    const item = document.createElement('div');
    item.className = 'queue-item';
    if (index === currentIndex) item.classList.add('active');
    if (index < currentIndex) item.classList.add('done');
    item.textContent = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
    list.appendChild(item);
  });
}

// 3. Lógica de Envio (A Mágica)
function getChatInput() {
  // Tentar seletores conhecidos do ChatGPT e Gemini
  const chatgptInput = document.querySelector('#prompt-textarea');
  const geminiInput = document.querySelector('div[contenteditable="true"].ql-editor') || 
                      document.querySelector('rich-textarea div[contenteditable="true"]');
  
  return chatgptInput || geminiInput;
}

function getSendButton() {
  const chatgptBtn = document.querySelector('button[data-testid="send-button"]');
  const geminiBtn = document.querySelector('button[aria-label*="Send"]') || 
                    document.querySelector('.send-button'); // Classe genérica, pode variar
                    
  return chatgptBtn || geminiBtn;
}

function sendNextPrompt() {
  if (currentIndex >= promptQueue.length) {
    alert("Fila finalizada! 🎉");
    return;
  }

  const promptText = promptQueue[currentIndex];
  const inputEl = getChatInput();

  if (!inputEl) {
    alert("Erro: Não encontrei a caixa de texto do chat. O site mudou?");
    return;
  }

  // Inserir texto
  inputEl.focus();
  
  // Método seguro para React/Angular (simula digitação)
  // Para ChatGPT (textarea)
  if (inputEl.tagName === 'TEXTAREA') {
    inputEl.value = promptText;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  } 
  // Para Gemini (div contenteditable)
  else {
    inputEl.innerHTML = ''; // Limpa antes
    document.execCommand('insertText', false, promptText);
  }

  // Pequeno delay para o botão de enviar ativar
  setTimeout(() => {
    const sendBtn = getSendButton();
    if (sendBtn) {
      sendBtn.click();
      
      // Atualizar estado
      currentIndex++;
      updateStatus();
      renderQueueList();
      
      const nextBtn = document.getElementById('btn-next');
      if (currentIndex < promptQueue.length) {
        nextBtn.textContent = `▶ Enviar Próximo (${currentIndex + 1}/${promptQueue.length})`;
      } else {
        nextBtn.textContent = "✅ Tudo Pronto!";
        nextBtn.disabled = true;
      }
    } else {
      // Tentar pressionar ENTER se não achar botão
      const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, keyCode: 13
      });
      inputEl.dispatchEvent(enterEvent);
      
      // Assumir sucesso
      currentIndex++;
      updateStatus();
      renderQueueList();
    }
  }, 500);
}

// Inicializar ao carregar a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createInterface);
} else {
  createInterface();
}
