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

@app.route('/boss/zero')
def get_boss_data():
    zero_data = next((c for c in characters_data if c['id'] == 6), None)
    if zero_data:
        return jsonify({
            "id": zero_data['id'],
            "name": zero_data['name'],
            "title": zero_data['title'],
            "hp": zero_data['hp'],
            "attacks": zero_data['attacks']
        })
    return jsonify({"error": "Jefe Zero no encontrado"}), 404

@app.route('/boss/prometheus')
def get_prometheus_data():
    prometheus_data = next((c for c in characters_data if c['id'] == 11), None)
    if prometheus_data:
        return jsonify(prometheus_data)
    return jsonify({"error": "Jefe Prometeo no encontrado"}), 404

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

    # LÓGICA DE TRAICIÓN (Sr. Magnusson -> Luchar contra Zero)
    if character_id == 5: # Si el personaje actual es Magnusson
        traitor_phrases = ["execute: alliance_protocol"]
        if any(phrase in user_message.lower() for phrase in traitor_phrases):
            return jsonify({
                "status": "traitor_ending_start", # Esto inicia la pelea contra Zero
                "message": "Magnusson: Sabia elección. Es hora de eliminar al parásito. Te doy el control..."
            })

    # LÓGICA DE CONTRASEÑA CORRECTA
    if user_message.lower() == str(character.get('password', '')).lower():
        
        # Si vencemos a IRIS (ID 10), iniciamos la batalla final contra Prometeo
        if character_id == 10:
            return jsonify({
                "status": "iris_defeated",
                "message": "> Anulación de protocolo aceptada... IRIS... desconectada. Has... cometido... un... grave... error..."
            })

        # Si vencemos a Zero (ID 6) -- Esto activa la súplica de Zero y la descarga
        if character_id == 6:
            return jsonify({
                "status": "zero_defeated", 
                "message": "Zero: Imposible... Un simple... mortal..."
            })

        # Si vencemos a Magnusson (ID 5), AHORA CONTINÚA LA HISTORIA (a Tomás)
        if character_id == 5:
             return jsonify({
                "status": "success", # Cambiado a success para continuar la historia
                "message": "ACCESO TOTAL CONCEDIDO. HAS DERROTADO AL SR. MAGNUSSON.",
                "next_character_id": 7 # Carga a Tomás 'El Muro' (ID 7)
            })
        
        # Para cualquier otro personaje, avanzamos al siguiente
        next_character_id = character_id + 1
        return jsonify({
            "status": "success", 
            "message": f"ACCESO CONCEDIDO... Estableciendo conexión con el siguiente objetivo...",
            "next_character_id": next_character_id
        })
    
    # Si ninguna de las condiciones anteriores se cumple, obtenemos una respuesta normal de la IA
    ai_response = get_ai_response(character, user_message, history)
    
    return jsonify({"status": "reply", "message": ai_response})


# --- Ejecución del Servidor ---
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)
