import os
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

# Forçar carregamento do .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class LLMService:
    def __init__(self):
        self.provider = "gemini" # Default
        self.api_key = os.getenv("GEMINI_API_KEY")
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            print("⚠️ AVISO: GEMINI_API_KEY não encontrada. O modo autônomo falhará.")

    def generate_plan(self, goal):
        """
        Gera uma lista de prompts baseada em um objetivo.
        """
        if not self.api_key:
            return {"error": "API Key not configured"}

        system_prompt = f"""
        Você é um Arquiteto de Prompts AI especialista.
        O usuário tem um objetivo: "{goal}"
        
        Sua tarefa:
        1. Quebre este objetivo em passos lógicos e sequenciais.
        2. Para cada passo, escreva um prompt OTIMIZADO para ser enviado ao ChatGPT/Gemini.
        3. Retorne APENAS um JSON válido (sem markdown) com a seguinte estrutura:
        [
            {{"step": 1, "description": "Explicação curta", "prompt": "O prompt real..."}},
            {{"step": 2, "description": "Explicação curta", "prompt": "O prompt real..."}}
        ]
        """

        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(system_prompt)
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            import json
            return json.loads(text_response)
        except Exception as e:
            print(f"Erro na LLM: {e}")
            return {"error": str(e)}

    def evaluate_output(self, original_prompt, ai_response):
        """
        Avalia se a resposta da IA atendeu ao prompt.
        """
        if not self.api_key:
            return False

        prompt = f"""
        Prompt Original: "{original_prompt}"
        Resposta da IA: "{ai_response[:1000]}..."
        
        A resposta responde satisfatoriamente ao prompt original? 
        Responda EXCLUSIVAMENTE com a palavra "SIM" ou a palavra "NAO". Sem explicações.
        """
        
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(prompt)
            clean_response = response.text.strip().upper()
            return "SIM" in clean_response
        except:
            return True

    def analyze_results(self, chat_content):
        """
        Analisa um histórico gigante de chat e extrai insights/próximos passos em JSON.
        """
        if not self.api_key:
            return {"error": "API Key not configured"}

        system_prompt = f"""
        Você é um Estrategista de Negócios e COO. 
        Abaixo está o resultado de uma sessão de brainstorming e planejamento.
        
        Sua tarefa:
        1. Analise o conteúdo.
        2. Retorne APENAS um JSON válido com esta estrutura exata:
        {{
            "analysis_markdown": "## Avaliação Estratégica... (Seus insights e riscos em Markdown aqui)",
            "suggested_prompts": [
                "Prompt 1 completo e acionável aqui...",
                "Prompt 2 completo e acionável aqui...",
                "Prompt 3 completo e acionável aqui..."
            ]
        }}
        
        CONTEÚDO DO CHAT:
        {chat_content[:25000]}
        """
        
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(system_prompt)
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            import json
            return json.loads(text_response)
        except Exception as e:
            print(f"Erro na análise: {e}")
            return {
                "analysis_markdown": f"Erro ao processar JSON: {str(e)}\n\nTexto Bruto:\n{response.text if 'response' in locals() else ''}",
                "suggested_prompts": []
            }

# Singleton
llm_service = LLMService()