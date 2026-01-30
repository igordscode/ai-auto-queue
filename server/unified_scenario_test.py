import threading
import time
from app import app
import test_scenarios

def run_server():
    # Rodar sem reloader para não travar a thread
    app.run(port=5000, debug=False, use_reloader=False)

if __name__ == "__main__":
    # Iniciar servidor em background
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    
    print("⏳ Aguardando servidor iniciar...")
    time.sleep(5) 
    
    # Rodar os cenários importados
    print("🚀 Rodando cenários...")
    test_scenarios.test_planning_success()
    test_scenarios.test_planning_error()
    test_scenarios.test_evaluation_good()
    test_scenarios.test_evaluation_bad()
    
    print("\n✅ Fim dos testes unificados.")

