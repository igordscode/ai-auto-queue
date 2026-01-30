import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from llm_service import llm_service

# Carregar variáveis de ambiente com caminho absoluto
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path)

app = Flask(__name__)
CORS(app)  # Permite chamadas da extensão do Chrome

# Configuração de Diretórios
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')

for d in [OUTPUT_DIR, LOGS_DIR]:
    os.makedirs(d, exist_ok=True)

# --- ROTAS DA API v3.0 (Brain) ---

@app.route('/api/plan', methods=['POST'])
def create_plan():
    """
    Recebe um objetivo de alto nível e retorna um plano estruturado (lista de prompts) gerado via LLM.
    """
    data = request.json
    goal = data.get('goal', '')
    
    if not goal:
        return jsonify({"error": "Goal is required"}), 400
    
    print(f"🧠 Planejando para: {goal}")
    
    # Gera o plano usando o serviço de LLM
    plan = llm_service.generate_plan(goal)
    
    if "error" in plan:
         return jsonify({"status": "error", "message": plan["error"]}), 500

    return jsonify({
        "status": "success",
        "plan": plan,
        "message": "Plano gerado com sucesso pela IA"
    })

@app.route('/api/evaluate', methods=['POST'])
def evaluate_response():
    """
    Analisa a resposta do ChatGPT e decide o próximo passo usando IA.
    """
    data = request.json
    original_prompt = data.get('prompt', '')
    ai_response = data.get('response', '')
    
    if not original_prompt or not ai_response:
        return jsonify({"error": "Missing prompt or response"}), 400
    
    print(f"🧐 Avaliando resposta...")
    
    # Chama o LLM Service para julgar a qualidade
    evaluation = llm_service.evaluate_output(original_prompt, ai_response)
    
    # Se evaluation for True (aprovado), seguimos. Se False, sugerimos retry.
    is_approved = evaluation
    
    return jsonify({
        "approved": is_approved,
        "next_action": "continue" if is_approved else "retry",
        "feedback": "Resposta aprovada pela IA." if is_approved else "Resposta parece incompleta ou desviou do tema."
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_chat():
    """
    Recebe o conteúdo completo do chat e devolve uma análise estratégica.
    """
    data = request.json
    content = data.get('content', '')
    
    if not content:
        return jsonify({"error": "Content is required"}), 400
    
    print(f"🧐 Analisando chat ({len(content)} caracteres)...")
    
    analysis = llm_service.analyze_results(content)
    
    return jsonify({
        "status": "success",
        "analysis": analysis
    })

# --- ROTAS LEGADO (v2.0) ---

@app.route('/save', methods=['POST'])
def save_file():
    """Salva o log completo da conversa em Markdown"""
    data = request.json
    filename = data.get('filename', 'session.md')
    content = data.get('content', '')
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({"status": "saved", "path": filepath})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "version": "3.0.0-alpha",
        "mode": "autonomous"
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 AI Queue Master Brain rodando em http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
