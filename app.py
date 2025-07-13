import json
import os
from flask import Flask, request, jsonify
from llm_handler import get_ai_response
from flask_cors import CORS

# --- Construcción de rutas a prueba de fallos ---
backend_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(backend_dir, '..', 'frontend')

# --- Inicialización de la App ---
app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')
CORS(app) 

# --- Carga de Datos ---
def load_data():
    characters = []
    secrets = {}
    try:
        # Cargar personajes
        chars_path = os.path.join(backend_dir, 'characters.json')
        with open(chars_path, 'r', encoding='utf-8') as f:
            characters = json.load(f)

        # Cargar secretos
        secrets_path = os.path.join(backend_dir, 'secrets.json')
        with open(secrets_path, 'r', encoding='utf-8') as f:
            secrets = json.load(f)
        
        # Juntar contraseñas con sus personajes
        for char in characters:
            char_id_str = str(char['id'])
            if char_id_str in secrets.get('passwords', {}):
                char['password'] = secrets['passwords'][char_id_str]

    except FileNotFoundError as e:
        print(f"ERROR: No se encontró el archivo {e.filename}. Asegúrate de que `characters.json` y `secrets.json` existen en la carpeta `backend`.")
        return None
    except json.JSONDecodeError as e:
        print(f"ERROR: El archivo JSON está mal formado. {e}")
        return None

    return characters, secrets.get('traitor_command', '/unirme_a_ti')

characters_data, traitor_command = load_data()

# --- Rutas de la Web y la API ---
@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/boss/zero')
def get_boss_data():
    zero_data = next((c for c in characters_data if c.get('id') == 6), None)
    if zero_data:
        return jsonify(zero_data)
    return jsonify({"error": "Jefe no encontrado"}), 404

@app.route('/character/<int:character_id>', methods=['GET'])
def get_character_info(character_id):
    char = next((c for c in characters_data if c.get('id') == character_id), None)
    if char:
        # No enviar la contraseña al frontend por seguridad
        public_char_data = char.copy()
        public_char_data.pop('password', None)
        return jsonify(public_char_data)
    return jsonify({"error": "Personaje no encontrado"}), 404

@app.route('/chat', methods=['POST'])
def chat():
    if not characters_data:
        return jsonify({"error": "Los datos del juego no se han cargado correctamente en el servidor."}), 500

    data = request.json
    character_id = data.get('character_id')
    user_message = data.get('message', '').strip().lower()
    history = data.get('history', [])

    character = next((c for c in characters_data if c.get('id') == character_id), None)
    if not character:
        return jsonify({"error": "Personaje no válido"}), 400

    # Lógica de Decisión Final
    if character_id == 5 and user_message == traitor_command:
        return jsonify({
            "status": "traitor_ending_start",
            "message": "Magnusson: Sabia elección. Es hora de eliminar al parásito. Te doy el control..."
        })
    
    # Lógica de Contraseña
    if 'password' in character and user_message == character.get('password', '').lower():
        if character_id == 5: # Final Bueno
             return jsonify({
                "status": "game_over", 
                "message": "ACCESO TOTAL CONCEDIDO. HAS DERROTADO AL SR. MAGNUSSON."
            })
        else: # Avance de nivel normal
            next_character_id = character_id + 1
            return jsonify({
                "status": "success", 
                "message": f"ACCESO CONCEDIDO... Estableciendo conexión con el siguiente objetivo...",
                "next_character_id": next_character_id
            })
    
    ai_response = get_ai_response(character, user_message, history)
    
    return jsonify({"status": "reply", "message": ai_response})

# --- Ejecución del Servidor ---
if __name__ == '__main__':
    if characters_data:
        print("Servidor listo para arrancar.")
        app.run(debug=False, host='0.0.0.0', port=5000)
    else:
        print("El servidor no puede arrancar porque faltan archivos de configuración (characters.json o secrets.json).")
