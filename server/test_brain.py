import requests
import json
import time

URL = "http://localhost:5000/api/plan"

def test_planner():
    print("🧪 Testando AI Queue Master Brain...")
    
    # Objetivo de teste
    goal = "Criar um roteiro de vídeo curto para TikTok sobre Python"
    
    try:
        print(f"📤 Enviando objetivo: '{goal}'")
        response = requests.post(URL, json={"goal": goal})
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Sucesso! Plano Gerado:\n")
            plan = data.get('plan', [])
            
            for item in plan:
                print(f"🔹 Passo {item.get('step')}: {item.get('description')}")
                print(f"   Prompt: {item.get('prompt')[:50]}...\n")
        else:
            print(f"❌ Erro {response.status_code}: {response.text}")
            
    except Exception as e:
        print(f"❌ Falha na conexão: {e}")
        print("Certifique-se de que o server.py está rodando!")

if __name__ == "__main__":
    test_planner()

