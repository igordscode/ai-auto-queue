# 🚀 Queue Master PRO
### The Ultimate AI Automation & Bulk Prompting Suite

**Queue Master PRO** turns your favorite AI chat interface (ChatGPT, Gemini, etc.) into a powerful production line. Stop baby-sitting your generations. Load your prompts, hit start, and let Queue Master handle the rest.

---

## 🔥 Why Queue Master PRO?

Running complex workflows or bulk content generation? Queue Master PRO allows you to:
- **Queue It Up:** Paste dozens or hundreds of prompts at once.
- **Auto-Advance:** The extension detects when the AI finishes writing and automatically sends the next prompt.
- **Smart Handling:** Automatically clicks "Continue Generating" if the response gets cut off.
- **Auto-Save:** (Optional) Automatically captures every response and saves it to your local machine via the included Python server.
- **Stay Organized:** Visual progress tracking and easy queue management.

## ✨ Key Features

- **Bulk Prompt Loader:** Paste text with empty lines to create separate queue items instantly.
- **Smart Activity Monitor:** Intelligent detection of generation status to prevent skipping or double-sending.
- **Local Server Integration:** Keeps your data private and saved locally as `.md` or `.txt` files.
- **Minimalist UI:** floating panel that tucks away when you don't need it.

---

## 🛠️ Installation

### 1. Install the Extension
1. Download or Clone this repository.
2. Open Chrome/Edge and go to `chrome://extensions`.
3. Enable **Developer Mode** (top right).
4. Click **Load Unpacked** and select the folder `ai-auto-queue`.

### 2. (Optional) Setup Auto-Save Server
To enable saving responses to your computer:
1. Install Python (if not installed).
2. Install Flask:
   ```bash
   pip install flask flask-cors
   ```
3. Run the server:
   ```bash
   python server.py
   ```
   *The extension will show a Green indicator when connected.*

---

## 🚀 How to Use

1. **Open AI Chat:** Go to ChatGPT or Gemini.
2. **Load Prompts:** Paste your list of prompts into the Queue Master panel. Ensure there is an empty line between each prompt.
3. **Click "Carregar" (Load):** Your queue will be populated.
4. **Enable Automation:** Check the **"Auto-avançar & Salvar"** box.
5. **Start:** Click **"▶ Enviar Próximo"**.
6. **Relax:** Queue Master will send prompts one by one, wait for completion, save the result, and move to the next.

---

## 📂 Project Structure
- `content.js`: Core logic for queue management and DOM manipulation.
- `server.py`: Local Python server for file system operations.
- `manifest.json`: Chrome extension configuration.

---

*Maximize your AI productivity today with Queue Master PRO.*
