# CTF_AI: Infiltrado en MEGACORP

Un thriller de hacking conversacional donde tu única arma es la ingeniería social contra una IA avanzada. ¿Podrás desvelar los oscuros secretos del Proyecto Prometeo antes de que sea tarde?

## Características Principales

* **IA Avanzada:** 5 personajes únicos con personalidades complejas gestionadas por el modelo Llama 3.1. Cada partida es diferente.
* **Múltiples Finales:** Tus decisiones en la conversación final importan. ¿Serás leal a tu contacto o te unirás al enemigo? Incluye una batalla final épica contra un jefe.
* **Mecánicas de Hacking:** No es solo hablar. Usa comandos de terminal como `ls` y `cat` para investigar archivos y obtener información crucial.
* **Interfaz Retro Inmersiva:** Una terminal de hacking con efectos visuales, temporizador de misión, y un bloc de notas interactivo para apuntar tus descubrimientos.
* **Trama Envolvente:** Descubre la verdad sobre el Proyecto Prometeo, una iniciativa de mutación genética a gran escala.

## Requisitos

* Python 3.9 o superior.
* `pip` y `venv` para la gestión de paquetes.
* Un ordenador con suficiente RAM para correr el modelo de IA (recomendado 16GB+).

## Puesta en Marcha (Instalación)

Sigue estos pasos para lanzar el juego en tu máquina local.

1.  **Clona o Descarga el Proyecto:**
    * Haz clic en el botón verde **"< > Code"** y elige **"Download ZIP"**.
    * Descomprime el archivo en una carpeta.

2.  **Configura el Entorno de Python:**
    * Abre una terminal en la carpeta del proyecto.
    * Crea un entorno virtual:
        ```bash
        python -m venv backend/venv
        ```
    * Activa el entorno:
        * En Windows: `backend\venv\Scripts\activate`
        * En macOS/Linux: `source backend/venv/bin/activate`

3.  **Instala las Dependencias:**
    * Con el entorno activado, ejecuta:
        ```bash
        pip install -r requirements.txt
        ```

4.  **Descarga el Modelo de IA:**
    * Este proyecto está diseñado para usar el modelo `Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf`.
    * **Descárgalo desde su fuente oficial en Hugging Face:**
        * **[Enlace de Descarga Directa](https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/tree/main)**
    * **Importante:** Una vez descargado, coloca el archivo `.gguf` dentro de la carpeta `backend/models/`.
    * *(Nota: El archivo del modelo es grande, unos 5 Gigabytes).*


5.  **Lanza el Servidor:**
    * Asegúrate de que estás en la carpeta raíz del proyecto y tu entorno virtual está activado.
    * Ejecuta el servidor:
        ```bash
        python backend/app.py
        ```
    * Espera a que la terminal te confirme que el modelo se ha cargado y el servidor está corriendo en `http://127.0.0.1:5000`.

6.  **¡A Jugar!**
    * Abre tu navegador web y ve a:
        [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Cómo Jugar

* Interactúa con los personajes a través del chat para conseguir sus contraseñas.
* Usa el **Bloc de Notas** para apuntar información importante. Se guarda automáticamente.
* Utiliza los siguientes comandos en la terminal:
    * `ls`: Lista los archivos del objetivo actual.
    * `cat [archivo]`: Muestra el contenido de un archivo.
    * `clear` o `cls`: Limpia la pantalla.
    * `/reset`: Borra tu progreso y reinicia el juego.
    * `help`: Muestra esta lista de comandos.
