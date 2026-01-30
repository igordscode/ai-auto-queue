import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def print_result(test_name, success, details=""):
    icon = "✅" if success else "❌"
    print(f"{icon} {test_name}")
    if details:
        print(f"   Details: {details}\n")

def test_planning_success():
    print("--- Teste 1: Planejamento Normal ---")
    goal = "Explicar como funciona uma API REST"
    try:
        response = requests.post(f"{BASE_URL}/plan", json={"goal": goal})
        if response.status_code == 200:
            plan = response.json().get('plan', [])
            success = len(plan) > 0 and 'prompt' in plan[0]
            print_result("Generate Plan", success, f"Steps generated: {len(plan)}")
        else:
            print_result("Generate Plan", False, f"Status: {response.status_code}")
    except Exception as e:
        print_result("Generate Plan", False, str(e))

def test_planning_error():
    print("--- Teste 2: Planejamento com Input Inválido ---")
    try:
        response = requests.post(f"{BASE_URL}/plan", json={"goal": ""})
        success = response.status_code == 400
        print_result("Handle Empty Goal", success, response.json().get('error'))
    except Exception as e:
        print_result("Handle Empty Goal", False, str(e))

def test_evaluation_good():
    print("--- Teste 3: Avaliação de Resposta Boa ---")
    prompt = "Qual a capital da França?"
    response_text = "A capital da França é Paris. É uma cidade conhecida por..."
    
    try:
        res = requests.post(f"{BASE_URL}/evaluate", json={"prompt": prompt, "response": response_text})
        data = res.json()
        # Esperamos que approved seja True
        success = data.get('approved') is True
        print_result("Evaluate Good Response", success, f"Approved: {data.get('approved')}")
    except Exception as e:
        print_result("Evaluate Good Response", False, str(e))

def test_evaluation_bad():
    print("--- Teste 4: Avaliação de Resposta Ruim ---")
    prompt = "Qual a capital da França?"
    response_text = "Receita de bolo de cenoura: misture farinha, ovos..."
    
    try:
        res = requests.post(f"{BASE_URL}/evaluate", json={"prompt": prompt, "response": response_text})
        data = res.json()
        # Esperamos que approved seja False (ou pelo menos a IA fique confusa)
        # Nota: Depende da LLM ser esperta. Gemini Flash geralmente é.
        success = data.get('approved') is False
        print_result("Evaluate Bad Response", success, f"Approved: {data.get('approved')}")
    except Exception as e:
        print_result("Evaluate Bad Response", False, str(e))

if __name__ == "__main__":
    print("🧪 Iniciando Bateria de Testes do Backend v3.0\n")
    # Pequeno delay para garantir que server tá de pé se rodado em script composto
    time.sleep(1)
    
    test_planning_success()
    test_planning_error()
    test_evaluation_good()
    test_evaluation_bad()
    
    print("\n🏁 Testes Finalizados.")
