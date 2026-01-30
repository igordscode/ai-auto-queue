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
        title: "AI PROMPT QUEUE v3",
        placeholder: "Cole seus prompts aqui.\n\nExemplo:\nPrompt 1: Crie um título...\n\n(Deixe uma linha vazia)\n\nPrompt 2: Agora escreva o texto...",
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
        itemRegistered: "📝 Item",
        tabQueue: "FILA MANUAL",
        tabAgent: "AGENTE AUTO",
        agentGoalPlaceholder: "Qual é o seu objetivo?\nEx: Escreva um curso de Python para iniciantes com 5 capítulos.",
        agentBtnPlan: "🧠 Planejar com IA",
        agentBtnApprove: "✅ Aprovar e Carregar",
        agentBtnAnalyze: "🧐 Analisar e Sugerir",
        planning: "🤔 Pensando...",
        analyzing: "🔎 Analisando...",
        planError: "Erro ao processar"
    },
    'en': {
        title: "AI PROMPT QUEUE v3",
        placeholder: "Paste your prompts here.\n\nExample:\nPrompt 1: Create a title...\n\n(Leave an empty line)\n\nPrompt 2: Now write the text...",
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
        itemRegistered: "📝 Item",
        tabQueue: "MANUAL QUEUE",
        tabAgent: "AUTO AGENT",
        agentGoalPlaceholder: "What is your goal?\ne.g., Write a Python course for beginners with 5 chapters.",
        agentBtnPlan: "🧠 Plan with AI",
        agentBtnApprove: "✅ Approve & Load",
        agentBtnAnalyze: "🧐 Analyze & Pivot",
        planning: "🤔 Thinking...",
        analyzing: "🔎 Analyzing...",
        planError: "Process Error"
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
        <!-- Tabs -->
        <div class="queue-tabs">
            <button class="queue-tab active" data-tab="tab-manual">${lang.tabQueue}</button>
            <button class="queue-tab" data-tab="tab-agent">${lang.tabAgent}</button>
        </div>

        <!-- Manual Queue Content -->
        <div id="tab-manual" class="tab-content active">
            <textarea id="ai-queue-input" placeholder="${lang.placeholder}"></textarea>
            <div class="queue-controls" style="margin-top:8px;">
                <button id="btn-load" class="queue-btn">${ICONS.load} ${lang.load}</button>
                <button id="btn-clear" class="queue-btn">${ICONS.clear} ${lang.clear}</button>
            </div>
        </div>

        <!-- Agent Mode Content -->
        <div id="tab-agent" class="tab-content">
            <div class="agent-form">
                <textarea id="agent-goal" class="agent-input" placeholder="${lang.agentGoalPlaceholder}"></textarea>
                <div style="display:flex; gap:5px;">
                    <button id="btn-agent-plan" class="agent-btn" style="flex:1;">${lang.agentBtnPlan}</button>
                    <button id="btn-agent-analyze" class="agent-btn" style="flex:1; background:#2980b9;">${lang.agentBtnAnalyze}</button>
                </div>
            </div>
            <div id="agent-analysis-result" class="analysis-box" style="display:none;"></div>
            <div id="agent-plan-preview" class="plan-preview" style="display:none;"></div>
            <button id="btn-agent-approve" class="agent-btn" style="display:none; margin-top:10px; background: #27ae60;">${lang.agentBtnApprove}</button>
        </div>

        <div style="border-top: 1px solid #333; margin: 10px 0;"></div>

        <input type="text" id="session-name" class="qm-input" placeholder="${lang.filenamePlaceholder}">
        
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

  // Event Listeners for Tabs
  document.querySelectorAll('.queue-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
          document.querySelectorAll('.queue-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          e.target.classList.add('active');
          document.getElementById(e.target.dataset.tab).classList.add('active');
      });
  });

  // Agent Listeners
  document.getElementById('btn-agent-plan').addEventListener('click', generatePlan);
  document.getElementById('btn-agent-analyze').addEventListener('click', analyzeChat);
  document.getElementById('btn-agent-approve').addEventListener('click', approvePlan);

  document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);
  document.getElementById('btn-load').addEventListener('click', loadQueue);
  document.getElementById('btn-clear').addEventListener('click', clearQueue);
  document.getElementById('btn-next').addEventListener('click', () => sendNextPrompt(true));
  document.getElementById('btn-download-log').addEventListener('click', () => downloadFullLog(true));
  document.getElementById('chk-auto-advance').addEventListener('change', (e) => autoAdvance = e.target.checked);
  document.getElementById('session-name').addEventListener('input', (e) => localStorage.setItem('qm_session_name', e.target.value));
}

// --- Agent Functions ---

async function generatePlan() {
    const goal = document.getElementById('agent-goal').value;
    const btn = document.getElementById('btn-agent-plan');
    const preview = document.getElementById('agent-plan-preview');
    const analysisBox = document.getElementById('agent-analysis-result');
    
    if (!goal.trim()) return alert(lang.noInput);

    btn.disabled = true;
    btn.textContent = lang.planning;
    preview.innerHTML = '';
    preview.style.display = 'none';
    analysisBox.style.display = 'none';
    document.getElementById('btn-agent-approve').style.display = 'none';

    try {
        const response = await fetch('http://localhost:5000/api/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal: goal })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            window.agentPlan = data.plan; 
            renderPlanPreview(data.plan);
        } else {
            alert('Error: ' + (data.message || lang.planError));
        }
    } catch (e) {
        alert(lang.planError + ': ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = lang.agentBtnPlan;
    }
}

async function analyzeChat() {
    const btn = document.getElementById('btn-agent-analyze');
    const analysisBox = document.getElementById('agent-analysis-result');
    
    btn.disabled = true;
    btn.textContent = lang.analyzing;
    analysisBox.style.display = 'none';

    // Capturar todo o conteúdo do chat visível
    const chatContent = Array.from(document.querySelectorAll('.markdown, .model-response-text, .message-content'))
        .map(el => el.innerText)
        .join('\n\n---\n\n');

    if (!chatContent) {
        alert('No chat content found to analyze!');
        btn.disabled = false;
        btn.textContent = lang.agentBtnAnalyze;
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: chatContent })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Limpar conteúdo anterior
            analysisBox.innerHTML = '';
            
            // 1. Renderizar Texto da Análise
            const analysisText = data.analysis.analysis_markdown || "No analysis text returned.";
            const textContainer = document.createElement('div');
            textContainer.innerHTML = `<h3>Analysis Result</h3>` + analysisText.replace(/\n/g, '<br>');
            analysisBox.appendChild(textContainer);
            
            // 2. Renderizar Botões de Sugestão (DOM real para funcionar o click)
            const prompts = data.analysis.suggested_prompts || [];
            if (prompts.length > 0) {
                const separator = document.createElement('div');
                separator.style.cssText = "margin-top:15px; border-top:1px solid #333; padding-top:10px;";
                separator.innerHTML = `<h4 style="color:#27ae60; margin:0 0 8px 0;">🚀 Recommended Next Steps</h4>`;
                analysisBox.appendChild(separator);
                
                prompts.forEach((p, idx) => {
                    const item = document.createElement('div');
                    item.className = 'plan-item';
                    item.style.cssText = "border-left-color: #27ae60; cursor:pointer; margin-bottom: 8px; transition: background 0.2s;";
                    item.onmouseover = () => item.style.background = 'rgba(39, 174, 96, 0.1)';
                    item.onmouseout = () => item.style.background = 'rgba(255,255,255,0.05)';
                    
                    item.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong>Option ${idx + 1}</strong>
                            <span style="font-size:10px; background:#27ae60; color:white; padding:2px 6px; border-radius:4px;">CLICK TO ADD</span>
                        </div>
                        <p>${p}</p>
                    `;
                    
                    // Adicionar Listener de Clique Seguro
                    item.addEventListener('click', function() {
                        addSuggestedPrompt(p);
                    });
                    
                    analysisBox.appendChild(item);
                });
            }

            analysisBox.style.display = 'block';
        } else {
            alert('Error: ' + data.error);
        }
    } catch (e) {
        alert(lang.planError + ': ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = lang.agentBtnAnalyze;
    }
}

function addSuggestedPrompt(promptText) {
    promptQueue.push(promptText);
    updateStatus();
    renderQueueList();
    updateNextButtonText();
    
    // Trocar para a aba Manual para o usuário ver
    document.querySelector('[data-tab="tab-manual"]').click();
    
    // Feedback visual
    const notification = document.createElement('div');
    notification.textContent = "Prompt Added to Queue! 🚀";
    notification.style.cssText = "position:fixed; bottom:20px; right:20px; background:#27ae60; color:white; padding:10px 20px; border-radius:5px; z-index:1000000; font-size:12px; box-shadow:0 4px 10px rgba(0,0,0,0.3);";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function renderPlanPreview(plan) {
    const container = document.getElementById('agent-plan-preview');
    container.style.display = 'block';
    
    let html = '';
    plan.forEach(step => {
        html += `
            <div class="plan-item">
                <h4>Step ${step.step}</h4>
                <p>${step.description}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('btn-agent-approve').style.display = 'flex';
}

function approvePlan() {
    if (!window.agentPlan) return;
    const prompts = window.agentPlan.map(p => p.prompt);
    promptQueue = [...promptQueue, ...prompts];
    updateStatus();
    renderQueueList();
    updateNextButtonText();
    document.querySelector('[data-tab="tab-manual"]').click();
    window.agentPlan = null;
    document.getElementById('agent-goal').value = '';
    document.getElementById('agent-plan-preview').style.display = 'none';
    document.getElementById('btn-agent-approve').style.display = 'none';
}

// --- End Agent Functions ---

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
