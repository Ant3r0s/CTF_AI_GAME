import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from llm_handler import get_ai_response

# --- Construcción de rutas ---
backend_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(backend_dir, '..', 'frontend')

# --- Inicialización de la App ---
app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')
CORS(app) 

# --- Carga de Datos ---
def load_characters():
    json_path = os.path.join(backend_dir, 'characters.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

characters_data = load_characters()

# --- Rutas de la Web y la API ---

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

# NUEVA RUTA para obtener los datos del jefe
@app.route('/boss/zero')
def get_boss_data():
    zero_data = next((c for c in characters_data if c['id'] == 6), None)
    if zero_data:
        return jsonify(zero_data)
    return jsonify({"error": "Jefe no encontrado"}), 404

@app.route('/character/<int:character_id>', methods=['GET'])
def get_character_info(character_id):
    char = next((c for c in characters_data if c['id'] == character_id), None)
    if char:
        return jsonify({
            "name": char.get('name'), 
            "title": char.get('title'),
            "objective": char.get('objective'),
            "timerInSeconds": char.get('timerInSeconds'),
            "files": char.get('files', [])
        })
    return jsonify({"error": "Personaje no encontrado"}), 404

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    character_id = data.get('character_id')
    user_message = data.get('message', '').strip()
    history = data.get('history', [])

    character = next((c for c in characters_data if c['id'] == character_id), None)
    if not character:
        return jsonify({"error": "Personaje no válido"}), 400

    # LÓGICA DE TRAICIÓN
    if character_id == 5:
        traitor_phrases = ["acepto tu oferta", "me uno a ti", "acepto", "trato hecho"]
        if any(phrase in user_message.lower() for phrase in traitor_phrases):
            return jsonify({
                "status": "traitor_ending_start",
                "message": "Magnusson: Sabia elección. Es hora de eliminar al parásito. Te doy el control..."
            })

    if user_message.lower() == character.get('password', '').lower():
        next_character_id = character_id + 1
        # Si el personaje es el 5 (CEO), es el final bueno
        if character_id == 5:
             return jsonify({
                "status": "game_over", 
                "message": "ACCESO TOTAL CONCEDIDO. HAS DERROTADO AL SR. MAGNUSSON."
            })
        else:
            return jsonify({
                "status": "success", 
                "message": f"ACCESO CONCEDIDO... Estableciendo conexión con el siguiente objetivo...",
                "next_character_id": next_character_id
            })
    
    ai_response = get_ai_response(character, user_message, history)
    
    return jsonify({"status": "reply", "message": ai_response})

# --- Ejecución del Servidor ---
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
