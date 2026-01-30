import threading
import time
import requests
from app import app

def run_server():
    app.run(port=5000, debug=False, use_reloader=False)

def run_test():
    time.sleep(5) # Espera o server subir
    print("\n🧪 Testando AI Queue Master Brain (Unificado)...")
    goal = "Dicas de Python para iniciantes"
    try:
        response = requests.post("http://localhost:5000/api/plan", json={"goal": goal})
        print(f"Status: {response.status_code}")
        print(f"Resposta: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Erro no teste: {e}")

if __name__ == "__main__":
    import json
    # Sobe o server numa thread
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    
    # Roda o teste
    run_test()
