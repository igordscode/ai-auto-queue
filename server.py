import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)  # Permite que a extensão do Chrome fale com a gente

# Configuração
OUTPUT_DIR = os.path.join(os.getcwd(), 'output')
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def sanitize_filename(name):
    # Remove caracteres inválidos para nomes de arquivo
    return re.sub(r'[<>:"/\\|?*]', '', name)[:50]

@app.route('/save', methods=['POST'])
def save_response():
    data = request.json
    prompt_preview = data.get('prompt', 'sem_titulo')
    content = data.get('content', '')
    
    if not content:
        return jsonify({"status": "error", "message": "Conteúdo vazio"}), 400

    # Criar nome do arquivo: 2026-01-15_14-30_prompt-titulo.md
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    safe_title = sanitize_filename(prompt_preview.replace('\n', ' ').strip())
    filename = f"{timestamp}_{safe_title}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Prompt Original\n{data.get('prompt', '')}\n\n")
            f.write(f"# Resposta da IA\n---\n{content}")
        
        print(f"✅ Arquivo salvo: {filename}")
        return jsonify({"status": "success", "file": filename})
    except Exception as e:
        print(f"❌ Erro ao salvar: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "version": "1.0"})

if __name__ == '__main__':
    print(f"🚀 Queue Master Server rodando em http://localhost:5000")
    print(f"📂 Salvando arquivos em: {OUTPUT_DIR}")
    app.run(port=5000)
