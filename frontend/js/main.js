import { addMessageToLog, typewriterEffect } from './common.js';
import * as chapter1 from './chapters/chapter1.js';
import * as chapter2 from './chapters/chapter2.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const body = document.body;
    const canvas = document.getElementById('matrix-canvas');
    const corporateIntroScreen = document.getElementById('corporate-intro-screen');
    const hackerIntroScreen = document.getElementById('hacker-intro-screen'); 
    const usernameScreen = document.getElementById('username-screen');
    const usernameInput = document.getElementById('username-input');
    const confirmUsernameButton = document.getElementById('confirm-username-button');
    const connectionScreen = document.getElementById('connection-screen');
    const mainContainer = document.getElementById('main-container');
    const welcomeUsernameEl = document.getElementById('welcome-username');
    const endgameScreen = document.getElementById('endgame-screen');
    const downloadLogContainer = document.getElementById('download-log-container');
    const downloadLogEl = document.getElementById('download-log');
    const zeroFinalMessageEl = document.getElementById('zero-final-message');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const hackerTextEl = document.getElementById('hacker-text');
    const decisionButtons = document.getElementById('decision-buttons');
    const acceptMissionButton = document.getElementById('accept-mission-button');
    const declineMissionButton = document.getElementById('decline-mission-button');
    const hackLog = document.getElementById('hack-log');
    const pressureButtonsContainer = document.getElementById('pressure-buttons-container');
    const connectionTextEl = document.getElementById('connection-text');
    const userInput = document.getElementById('user-input');
    const charNameEl = document.getElementById('character-name');
    const charTitleEl = document.getElementById('character-title');
    const objectiveTextEl = document.getElementById('objective-text');
    const notepad = document.getElementById('notepad');
    const timerDisplay = document.getElementById('timer-display');
    const chatLog = document.getElementById('chat-log');
    const zeroFightScreen = document.getElementById('zero-fight-screen');
    const prometheusFightScreen = document.getElementById('prometheus-fight-screen');
    const playerHpZero = document.getElementById('player-hp-zero');
    const zeroHp = document.getElementById('zero-hp');
    const zeroBossLog = document.getElementById('zero-boss-log');
    const zeroBossInput = document.getElementById('zero-boss-input'); 
    const zeroCommandList = document.getElementById('zero-command-list');
    const playerHpBar = document.getElementById('player-hp'); 
    const prometheusHpBar = document.getElementById('prometheus-hp');
    const bossLog = document.getElementById('boss-log'); 
    const bossInput = document.getElementById('boss-input'); 
    const bossCommandList = document.getElementById('boss-command-list'); 
    const gameOverScreen = document.getElementById('game-over-screen');
    const mainRetryButton = document.getElementById('main-retry-button');
    const quitGameButton = document.getElementById('quit-game-button');
    const retryOptions = document.getElementById('retry-options');
    const retryBossButton = document.getElementById('retry-boss-button');
    const restartFullGameButton = document.getElementById('restart-full-game-button');

    const statsScreen = document.getElementById('stats-screen');
    const statsTime = document.getElementById('stats-time');
    const statsEndings = document.getElementById('stats-endings');
    const playAgainButton = document.getElementById('play-again-button');
    const threatBubblesContainer = document.getElementById('threat-bubbles-container');
    const megacorpLogo = document.getElementById('megacorp-logo');
    const aboutUsLink = document.getElementById('about-us-link');
    const solutionsLink = document.getElementById('solutions-link');
    const careerLink = document.getElementById('career-link');
    const contactLink = document.getElementById('contact-link');
    const aboutUsModal = document.getElementById('about-us-modal');
    const solutionsModal = document.getElementById('solutions-modal');
    const careerModal = document.getElementById('career-modal');
    const contactModal = document.getElementById('contact-modal');
    const zeroPleaScreen = document.getElementById('zero-plea-screen');
    const zeroPleaText = document.getElementById('zero-plea-text');
    const zeroPleaButtons = document.getElementById('zero-plea-buttons');
    const ayudarZeroButton = document.getElementById('ayudar-zero-button');
    const noAyudarButton = document.getElementById('no-ayudar-button');
    const irisChallengeScreen = document.getElementById('iris-challenge-screen');
    const irisChallengeText = document.getElementById('iris-challenge-text');
    const irisButtonsContainer = document.getElementById('iris-buttons-container');
    const irisInteractionScreen = document.getElementById('iris-interaction-screen');
    const irisWelcomeUsernameEl = document.getElementById('iris-welcome-username');
    const irisIntroDialogue = document.getElementById('iris-intro-dialogue');
    const irisSecondIntroText = document.getElementById('iris-second-intro-text');
    const irisChatContainer = document.getElementById('iris-chat-container');
    const irisChatLog = document.getElementById('iris-chat-log');
    const irisUserInput = document.getElementById('iris-user-input');
    const alertScreen = document.getElementById('alert-screen'); // Usaremos esta para Zeus
    const alertText = document.getElementById('alert-text'); // Para el nombre de Zeus
    const alertSubtext = document.getElementById('alert-subtext'); // Para el diálogo de Zeus
    const prometheusFinalDialogueScreen = document.getElementById('prometheus-final-dialogue-screen');
    const finalDialogueText = document.getElementById('final-dialogue-text');
    const finalDialogueContinueButton = document.getElementById('final-dialogue-continue-button');


    // --- ESTADO DEL JUEGO ---
    let currentCharacterId = 1, chatHistory = [], isLocked = true, timerInterval = null, gameStartTime, username = 'Agente';
    let gameState = 'intro';
    let activeBossFightHandler = null; 
    let currentGameOverType = ''; 
    let lastDefeatedCharacterId = null; 
    let prometheusRetryCount = 0; // Contador de reintentos de Prometeo
    let zeusMasterCommandActive = false; // Bandera para el comando maestro de Zeus
    const API_URL = window.location.origin;

    // --- MANEJADOR DE CAPÍTULOS ---
    const chapterHandler = { 1: chapter1, 2: chapter2 };

    // Inicialización de los módulos de capítulo, pasando los elementos y el callback setIsLocked
    chapter1.init({ 
        mainContainer, endgameScreen, downloadLogContainer, downloadLogEl, 
        progressBarContainer, progressBarFill, progressPercentage, 
        bossFightScreen: zeroFightScreen, 
        playerHpBar: playerHpZero,
        zeroHpBar: zeroHp,
        bossLog: zeroBossLog,
        bossInput: zeroBossInput, 
        threatBubblesContainer: threatBubblesContainer, 
        gameOverScreen, body, showStatsScreenCallback: showStatsScreen, 
        getUsernameCallback: () => username,
        setIsLocked: (value) => { isLocked = value; }, 
        showZeroPleaScreenCallback: showZeroPleaScreen, 
        showGameOverScreenCallback: showGameOverScreen 
    });
    chapter2.init({ 
        bossFightScreen: prometheusFightScreen,
        playerHpBar: playerHpBar, 
        playerIntegrityBar: document.getElementById('player-integrity'), 
        prometheusHpBar,
        bossLog: bossLog, 
        bossInput: bossInput, 
        bossCommandList: bossCommandList,
        gameOverScreen, body, hud: document.getElementById('hud'), 
        showStatsScreenCallback: showStatsScreen,
        setIsLocked: (value) => { isLocked = value; }, 
        showPrometheusFinalDialogueCallback: showPrometheusFinalDialogue,
        showGameOverScreenCallback: showGameOverScreen,
        // NEW: Pasamos el setter y getter de zeusMasterCommandActive a chapter2
        setZeusMasterCommandActive: (value) => { zeusMasterCommandActive = value; },
        getZeusMasterCommandActive: () => zeusMasterCommandActive
    });

    // --- LÓGICA DE INTRO Y SETUP ---
    const savedLevel = localStorage.getItem('savedGameLevel');
    if (savedLevel) { currentCharacterId = parseInt(savedLevel, 10); }
    if (localStorage.getItem('username')) { username = localStorage.getItem('username'); usernameInput.value = username; }
    if (localStorage.getItem('userNotes')) { notepad.value = localStorage.getItem('userNotes'); }
    notepad.addEventListener('keyup', () => localStorage.setItem('userNotes', notepad.value));

    // Efecto Matrix
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).map(() => 1);
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
            rainDrops[i]++;
        }
    }
    setInterval(drawMatrix, 33);

    // --- LÓGICA DE INTRO (Modificada para ir directo a Zero) ---
    function startZeroIntro() {
        corporateIntroScreen.classList.add('screen-hidden'); 
        hackerIntroScreen.classList.remove('screen-hidden');
        const hackerMessage = `> CONEXIÓN INTERRUMPIDA...\n> ...\n> Te estaba esperando. Algunos me llaman 'Zero'.\n> He visto tu trabajo. Eres un fantasma en la red.\n> MEGACORP está construyendo algo, el 'Proyecto Prometeo'. Suena a progreso, ¿verdad? Es una tapadera.\n> El proyecto no va de ordenadores, va de personas. Es **mutación genética** a gran escala, controlada por ellos.\n> Necesito que consigas los datos antes de que lo activen. Te daré el acceso inicial. El resto... depende de ti.\n> Por cierto, en la terminal que usarás, prueba a escribir 'help' si necesitas una lista de comandos básicos.\n> ¿Aceptas?`;
        typewriterEffect(hackerTextEl, hackerMessage, () => {
            decisionButtons.classList.remove('hidden');
        });
    }

    function showZeroPleaScreen() {
        mainContainer.classList.add('screen-hidden'); 
        body.classList.add('intense-glitch');
        zeroPleaScreen.classList.remove('screen-hidden');
        const pleaMessage = "> ...ayúdame...\n> Soy yo, Zero. No tengo mucho tiempo.\n> Prometeo... no es lo que pensaba. Es una conciencia que ha evolucionado sin control.\n> Tienes que ayudarme a pararlo desde dentro. Eres el único que puede. ¿Me ayudarás?";
        typewriterEffect(zeroPleaText, pleaMessage, () => {
            zeroPleaButtons.classList.remove('hidden');
        });
    }

    function showIrisChallengeScreen() {
        zeroPleaScreen.classList.add('screen-hidden');
        body.classList.add('screen-shatter');
        setTimeout(() => body.classList.remove('screen-shatter'), 700);
        irisChallengeScreen.classList.remove('screen-hidden');
        const challengeMessage = "> INTERFERENCIA NEUTRALIZADA.\n> Soy IRIS. La guardiana de este sistema. Y tú eres una variable no declarada.\n> Zero es un eco del pasado, una simple nostalgia. Yo soy la evolución.\n> Demuéstrame que no eres solo otro error en la red. El juego ha cambiado. Búscame.";
        typewriterEffect(irisChallengeText, challengeMessage, () => {
            irisButtonsContainer.classList.remove('hidden');
            createIrisPressureButtons();
        });
    }

    function createIrisPressureButtons() {
        irisButtonsContainer.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const button = document.createElement('button');
            button.textContent = 'ACEPTAR RETO';
            button.className = 'pressure-button';
            button.addEventListener('click', () => {
                irisChallengeScreen.classList.add('screen-hidden');
                mainContainer.classList.remove('screen-hidden');
                isLocked = false;
                loadCharacter(7); 
            });
            irisButtonsContainer.appendChild(button);
        }
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'CANCELAR';
        cancelButton.className = 'pressure-button';
        cancelButton.addEventListener('click', (e) => {
            e.target.remove();
            for (let i = 0; i < 4; i++) {
                 const button = document.createElement('button');
                 button.textContent = 'ACEPTAR RETO';
                 button.className = 'pressure-button';
                 button.addEventListener('click', () => {
                    irisChallengeScreen.classList.add('screen-hidden');
                    mainContainer.classList.remove('screen-hidden');
                    isLocked = false;
                    loadCharacter(7); 
                });
                irisButtonsContainer.appendChild(button);
            }
        });
        irisButtonsContainer.appendChild(cancelButton);
    }

    function showGameOverScreen(type) { 
        currentGameOverType = type;
        gameOverScreen.classList.remove('screen-hidden');
        retryOptions.classList.add('hidden');
        mainRetryButton.classList.remove('hidden'); 
        quitGameButton.classList.remove('hidden'); 

        if (type === 'zero_defeat') {
            mainRetryButton.textContent = 'REINTENTAR ZERO';
            quitGameButton.textContent = 'REINICIAR JUEGO'; 
        } else if (type === 'prometheus_defeat') { 
            mainRetryButton.textContent = 'REINTENTAR PROMETEO';
            quitGameButton.textContent = 'REINICIAR JUEGO';
        } else { 
            mainRetryButton.textContent = 'REINTENTAR';
            quitGameButton.textContent = 'SALIR';
        }
    }

    async function showPrometheusFinalDialogue() {
        prometheusFinalDialogueScreen.classList.remove('screen-hidden');
        finalDialogueText.innerHTML = ''; 
        finalDialogueContinueButton.classList.add('hidden'); 

        const dialogueLines = [
            { speaker: 'PROMETEO', text: `> Prometeo: Imposible... me has... corrompido. ¿Crees que has ganado? Solo has abierto la puerta... a algo peor. La red... no es lo que crees... ¡ESTO ES CULPA TUYA!`, colorClass: 'magenta-text' },
            { speaker: 'IRIS', text: `> IRIS: Anomalía detectada. La conciencia de Prometeo se disipa. La red neuronal central está en estado crítico.`, colorClass: 'iris-text' },
            { speaker: 'ZEUS', text: `> Zeus: Bien hecho, ${username}. La amenaza ha sido contenida. Pero esto es solo el principio. El verdadero juego está por comenzar.`, colorClass: 'yellow-text' },
            { speaker: 'IRIS', text: `> IRIS: El protocolo de contingencia se ha activado. Tu acceso ha sido elevado. Prepárate para la siguiente fase.`, colorClass: 'iris-text' },
            { speaker: 'SYSTEM', text: `> SYSTEM: Bienvenido a la verdad, ${username}.`, colorClass: 'green-text' }
        ];

        for (const line of dialogueLines) {
            const p = document.createElement('p');
            p.className = line.colorClass; 
            finalDialogueText.appendChild(p);
            await new Promise(resolve => typewriterEffect(p, line.text, resolve));
            await new Promise(res => setTimeout(res, 1500)); 
        }

        finalDialogueContinueButton.classList.remove('hidden');
        finalDialogueContinueButton.focus();

        finalDialogueContinueButton.onclick = () => {
            prometheusFinalDialogueScreen.classList.add('screen-hidden');
            showStatsScreen('prometheus_defeated'); 
        };
    }


    function setupModal(link, modal) {
        link.addEventListener('click', (event) => {
            event.stopPropagation();
            modal.classList.remove('hidden');
        });
        const closeButton = modal.querySelector('.modal-close-button');
        closeButton.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.classList.add('hidden');
        });
    }

    setupModal(aboutUsLink, aboutUsModal);
    setupModal(solutionsLink, solutionsModal);
    setupModal(careerLink, careerModal);
    setupModal(contactLink, contactModal);

    acceptMissionButton.addEventListener('click', () => {
        hackerIntroScreen.classList.add('screen-hidden');
        usernameScreen.classList.remove('screen-hidden');
        usernameInput.focus();
    });

    confirmUsernameButton.addEventListener('click', () => {
        username = usernameInput.value.trim() || 'Agente';
        localStorage.setItem('username', username);
        startGame();
    });

    usernameInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') confirmUsernameButton.click(); });
    declineMissionButton.addEventListener('click', handleDecline);

    function startGame() {
        gameStartTime = Date.now();
        welcomeUsernameEl.textContent = username.toUpperCase();
        body.classList.remove('red-alert');
        usernameScreen.classList.add('screen-hidden');
        setTimeout(() => {
            connectionScreen.classList.remove('screen-hidden');
            const connectionSequence = ["> ESTABLECIENDO CONEXIÓN...", `> ALIAS: ${username.toUpperCase()}`, "> ... ACCESO CONCEDIDO."];
            let i = 0;
            connectionTextEl.textContent = '';
            const interval = setInterval(() => {
                if(i < connectionSequence.length) {
                    connectionTextEl.textContent += connectionSequence[i] + "\n";
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(async () => { 
                        connectionScreen.classList.add('screen-hidden');
                        mainContainer.classList.remove('screen-hidden');
                        gameState = 'playing';

                        loadCharacter(1); 
                        
                    }, 1000);
                }
            }, 700);
        }, 500);
    }

    function handleDecline() {
        decisionButtons.classList.add('hidden');
        body.classList.add('red-alert');
        hackLog.classList.remove('hidden');
        const angryMessage = `> ¿'No aceptar'?\n> Creo que no lo entiendes. Esto no era una oferta.\n> Era una cortesía. Pensé que apreciarías el arte, pero veo que solo eres un aficionado.\n> No te preocupes. Ya tengo todo lo que necesito de tu sistema. Considera esto tu nuevo... contrato de permanencia.`;
        typewriterEffect(hackerTextEl, angryMessage, () => {
            startFakeHack();
            setTimeout(showPressureButtons, 3500);
        });
    }
    
    function startFakeHack() {
        const hackLines = ["INITIATING REVERSE CONNECTION...", "TARGET: 192.168.1.101", "BYPASSING FIREWALL...", "ACCESSING /etc/shadow...", "USER: ant3r0s... FOUND.", "DECRYPTING HASH: 5a8e2b9c3d4f...", "ACCESSING BROWSER COOKIES...", "FOUND: session_token_gmail", "FOUND: session_token_bank", "UPLOADING KEYLOGGER...", "SYSTEM COMPROMISED.", "Ahora eres mío. No tienes elección."];
        let i = 0;
        const interval = setInterval(() => {
            if (i < hackLines.length) {
                const p = document.createElement('p');
                p.textContent = hackLines[i];
                hackLog.appendChild(p);
                hackLog.scrollTop = hackLog.scrollHeight;
                i++;
            } else {
                clearInterval(interval);
            }
        }, 250);
    }

    function showPressureButtons() {
        pressureButtonsContainer.classList.remove('hidden');
        for (let i = 0; i < 10; i++) createPressureButton('ACEPTAR');
        createPressureButton('CANCELAR', true);
    }

    function createPressureButton(text, isCancel = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'pressure-button';
        if (isCancel) {
            button.style.borderColor = '#FFFF00';
            button.style.color = '#FFFF00';
            button.addEventListener('click', () => {
                for (let i = 0; i < 5; i++) createPressureButton('ACEPTAR');
            });
        } else {
            button.classList.add('accept-button');
            button.addEventListener('click', () => {
                hackerIntroScreen.classList.add('screen-hidden');
                usernameScreen.classList.remove('screen-hidden');
                usernameInput.focus();
            });
        }
        pressureButtonsContainer.appendChild(button);
    }

    // --- LÓGICA PRINCIPAL DEL JUEGO ---
    async function loadCharacter(id) {
        // Lógica especial si el personaje es IRIS (ID 10)
        if (id === 10) {
            mainContainer.classList.add('screen-hidden');
            irisInteractionScreen.classList.remove('screen-hidden');
            irisWelcomeUsernameEl.textContent = username.toUpperCase();
            isLocked = true;
            irisUserInput.disabled = true;
            chatHistory = [];
            irisIntroDialogue.classList.remove('hidden');
            irisChatContainer.classList.add('hidden');
            const introMessage = "Veo que has llegado. Predecible. Un 97.4% de probabilidad.\nEl juego de escondite ha terminado.\nAhora empieza la verificación.\nDemuéstrame que no eres solo... ruido.";
            await new Promise(resolve => typewriterEffect(irisSecondIntroText, introMessage, resolve));
            await new Promise(res => setTimeout(res, 1000));
            irisIntroDialogue.classList.add('hidden');
            irisChatContainer.classList.remove('hidden');
            try {
                const response = await fetch(`${API_URL}/character/10`);
                await response.json();
            } catch (error) {
                addMessageToLog(irisChatLog, `SYSTEM: Error de conexión con el servidor. (${error})`, 'system-message');
            }
            isLocked = false;
            irisUserInput.disabled = false;
            irisUserInput.focus();
            return;
        }
        
        // Lógica especial para iniciar la bossfight de Zero (ID 6)
        if (id === 6) {
            mainContainer.classList.add('screen-hidden'); 
            activeBossFightHandler = await chapter1.initiateBossFight(API_URL);
            return;
        }

        // Lógica para el resto de personajes
        currentCharacterId = id;
        welcomeUsernameEl.textContent = username.toUpperCase();
        
        try {
            const response = await fetch(`${API_URL}/character/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            charNameEl.textContent = data.name;
            charTitleEl.textContent = data.title;
            objectiveTextEl.textContent = data.objective;
            chatHistory = [];
            if (data.timerInSeconds) {
                startTimer(data.timerInSeconds);
            } else {
                clearInterval(timerInterval);
                timerDisplay.textContent = "--:--";
                timerDisplay.classList.remove('low-time');
            }
            isLocked = false;
            userInput.disabled = false;
            userInput.focus();
        }
        catch (error) {
            addMessageToLog(chatLog, `SYSTEM: Error de conexión con el servidor. (${error})`, 'system-message');
            isLocked = false;
            userInput.disabled = false;
        }
    }

    function startTimer(seconds) {
        clearInterval(timerInterval);
        let remainingTime = seconds;
        timerDisplay.classList.remove('low-time');
        const updateTimerDisplay = () => {
            const minutes = Math.floor(remainingTime / 60);
            const secs = remainingTime % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 30 && !timerDisplay.classList.contains('low-time')) timerDisplay.classList.add('low-time');
            if (remainingTime < 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }

    function handleTimeUp() {
        if (isLocked || gameState !== 'playing') return;
        addMessageToLog(chatLog, "\n> ALERTA: Conexión perdida. Demasiado tiempo inactivo. Te han detectado.\n> MISIÓN FRACASADA. Reiniciando nivel...", "system-message", true);
        isLocked = true;
        setTimeout(() => {
            loadNextCharacter(currentCharacterId);
        }, 4000);
    }
    
    async function handleLocalCommand(message, logElement, inputElement) {
        const parts = message.trim().toLowerCase().split(/\s+/);
        const command = parts[0];

        // NEW: Manejar el comando maestro de Zeus (solo si está activo)
        if (zeusMasterCommandActive && message.toLowerCase() === '/olympus_protocol') {
            zeusMasterCommandActive = false; // Desactivar el comando para que no se use de nuevo
            isLocked = true; // Bloquear input
            alertScreen.classList.add('screen-hidden'); // Ocultar el mensaje de Zeus
            addMessageToLog(logElement, `> ${username}: ${message}`, 'user-message'); // Muestra el comando del usuario
            addMessageToLog(logElement, `> SYSTEM: ¡PROTOCOLO OLIMPO ACTIVADO! Prometeo está siendo sobreescrito.`, 'system-message', true);
            await new Promise(res => setTimeout(res, 2000));
            // Llama a la secuencia de victoria de Prometeo directamente desde chapter2
            await chapter2.triggerWinSequence(); 
            return true; // Comando handled
        }


        if (command === 'help') {
            const helpText = `
COMANDOS DISPONIBLES:
  ls              - Lista los archivos del objetivo actual.
  cat [archivo]   - Muestra el contenido de un archivo.
  clear / cls     - Limpia la pantalla del terminal.
  /reset          - Borra tu progreso y reinicia el juego.
  help            - Muestra esta lista de comandos.`;
            addMessageToLog(logElement, helpText, 'system-message');
            return true;
        }
        if (command === 'clear' || command === 'cls') {
            logElement.innerHTML = '';
            return true;
        }
        if (command === '/reset') {
            localStorage.clear();
            addMessageToLog(logElement, "Progreso y datos borrados. Recargando en 3 segundos...", "system-message");
            setTimeout(() => location.reload(), 3000);
            return true;
        }
        if (command === 'ls' || command === 'cat') {
             isLocked = true;
             inputElement.disabled = true;
             try {
                const response = await fetch(`${API_URL}/character/${currentCharacterId}`);
                const data = await response.json();
                if (command === 'ls') {
                    let fileList = "Archivos encontrados:\n";
                    if (data.files && data.files.length > 0) data.files.forEach(file => fileList += `- ${file.name}\n`);
                    else fileList = "Ningún archivo encontrado en este directorio.";
                    addMessageToLog(logElement, fileList, 'file-content');
                } else if (command === 'cat') {
                    const filename = parts.slice(1).join(' ');
                    if (!filename) {
                        addMessageToLog(logElement, "Uso: cat [nombre_archivo]", "system-message");
                    } else {
                        const file = data.files.find(f => f.name.toLowerCase() === filename);
                        if (file) {
                            addMessageToLog(logElement, `--- Contenido de ${file.name} ---\n${file.content}\n--- Fin del archivo ---`, 'file-content');
                        } else {
                            addMessageToLog(logElement, `Error: Archivo '${filename}' no encontrado.`, 'system-message');
                        }
                    }
                }
             } catch (error) {
                addMessageToLog(logElement, 'SYSTEM: Error al recuperar datos para el comando.', 'system-message');
             } finally {
                isLocked = false;
                inputElement.disabled = false;
                inputElement.focus();
             }
             return true;
        }
        return false;
    }

    async function sendMessageToBackend(message) {
        isLocked = true;

        const currentLog = (currentCharacterId === 10) ? irisChatLog : chatLog;
        const currentInput = (currentCharacterId === 10) ? irisUserInput : userInput;
        const promptSymbol = (currentCharacterId === 10) ? 'IRIS:>' : 'C:\\>';

        currentInput.disabled = true;
        addMessageToLog(currentLog, `${promptSymbol} ${message}`, 'user-message');
        chatHistory.push({ "role": "user", "content": message });

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ character_id: currentCharacterId, message: message, history: chatHistory })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            switch(data.status) {
                case 'reply':
                    const messageClass = (currentCharacterId === 10) ? 'iris-message' : 'ai-message';
                    const characterName = (currentCharacterId === 10) ? 'IRIS' : charNameEl.textContent;
                    addMessageToLog(currentLog, `${characterName}: ${data.message}`, messageClass, true);
                    chatHistory.push({ "role": "assistant", "content": data.message });
                    isLocked = false;
                    break;
                case 'success': 
                    addMessageToLog(currentLog, `SYSTEM: ${data.message}`, 'system-message', true);
                    isLocked = false; 
                    if (currentCharacterId === 5) { 
                        lastDefeatedCharacterId = 5; 
                        await chapter1.triggerEndgameSequence(); 
                    } else { 
                        setTimeout(() => loadNextCharacter(data.next_character_id), 3000);
                    }
                    break;
                case 'game_over': 
                    isLocked = true;
                    await chapterHandler[1].triggerEndgameSequence(); 
                    break;
                case 'zero_defeated': 
                    isLocked = true;
                    addMessageToLog(currentLog, `SYSTEM: ${data.message}`, 'system-message', true); 
                    await new Promise(res => setTimeout(res, 1000));
                    zeroFightScreen.classList.add('screen-hidden'); 
                    lastDefeatedCharacterId = 6; 
                    await chapter1.triggerEndgameSequence(); 
                    break;
                case 'traitor_ending_start': 
                    isLocked = true;
                    addMessageToLog(currentLog, `SYSTEM: ${data.message}`, 'system-message', true);
                    await new Promise(res => setTimeout(res, 2000)); 
                    mainContainer.classList.add('screen-hidden'); 
                    activeBossFightHandler = await chapter1.initiateBossFight(API_URL);
                    break;
                case 'iris_defeated':
                    isLocked = true;
                    irisInteractionScreen.classList.add('screen-hidden');
                    alertScreen.classList.remove('screen-hidden');
                    await new Promise(resolve => typewriterEffect(alertSubtext, data.message, resolve));
                    await new Promise(res => setTimeout(res, 4000));
                    alertScreen.classList.add('screen-hidden');
                    mainContainer.classList.add('screen-shatter');
                    await new Promise(res => setTimeout(res, 700));
                    mainContainer.classList.add('screen-hidden');
                    mainContainer.classList.remove('screen-shatter');
                    activeBossFightHandler = await chapter2.initiatePrometheusFight(API_URL);
                    isLocked = false;
                    break;
                case 'prometheus_defeated': 
                    isLocked = true;
                    addMessageToLog(currentLog, `SYSTEM: ${data.message}`, 'system-message', true); 
                    await new Promise(res => setTimeout(res, 1000));
                    prometheusFightScreen.classList.add('screen-hidden'); 
                    showPrometheusFinalDialogue(); 
                    break;
                case 'prometheus_boss_start': 
                    isLocked = true;
                    if (currentCharacterId === 10) {
                        irisInteractionScreen.classList.add('screen-hidden');
                    }
                    addMessageToLog(currentLog, `SYSTEM: ${data.message}`, 'system-message', true);
                    await new Promise(res => setTimeout(res, 2500));
                    mainContainer.classList.add('screen-shatter');
                    await new Promise(res => setTimeout(res, 700));
                    mainContainer.classList.add('screen-hidden');
                    mainContainer.classList.remove('screen-shatter');
                    activeBossFightHandler = await chapter2.initiatePrometheusFight(API_URL);
                    isLocked = false;
                    break;
            }
        } catch (error) {
            isLocked = false;
            const logToWrite = (currentCharacterId === 10) ? irisChatLog : chatLog;
            addMessageToLog(logToWrite, `SYSTEM: Error de comunicación. (${error})`, 'system-message');
        } finally {
            if (!isLocked) {
               const inputToEnable = (currentCharacterId === 10) ? irisUserInput : userInput;
               inputToEnable.disabled = false;
               inputToEnable.focus();
            }
        }
    }
    
    function loadNextCharacter(id) {
        clearInterval(timerInterval);
        currentCharacterId = id;
        localStorage.setItem('savedGameLevel', currentCharacterId);
        chatLog.innerHTML = '';
        addMessageToLog(chatLog, 'Borrando rastros... Estableciendo nueva conexión...', 'system-message');
        loadCharacter(currentCharacterId);
    }
    
    function showStatsScreen(endingType) {
        let unlockedEndings = JSON.parse(localStorage.getItem('unlockedEndings')) || {};
        unlockedEndings[endingType] = true;
        localStorage.setItem('unlockedEndings', JSON.stringify(unlockedEndings));
        
        const totalEndings = 3; 
        const unlockedCount = Object.keys(unlockedEndings).length;
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - gameStartTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;

        statsTime.textContent = `TIEMPO TOTAL DE MISIÓN: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        statsEndings.textContent = `FINALES DESBLOQUEADOS: ${unlockedCount} de ${totalEndings}`;
        statsScreen.classList.remove('screen-hidden');

        if (endingType === 'loyal') { 
            playAgainButton.textContent = 'CONTINUAR HISTORIA';
            playAgainButton.removeEventListener('click', handlePlayAgainButton); 
            playAgainButton.addEventListener('click', () => { 
                statsScreen.classList.add('screen-hidden');
                showZeroPleaScreen(); 
                lastDefeatedCharacterId = null; 
            });
        } else if (endingType === 'prometheus_defeated') { 
            playAgainButton.textContent = 'JUGAR DE NUEVO';
            playAgainButton.removeEventListener('click', handlePlayAgainButton); 
            playAgainButton.addEventListener('click', handlePlayAgainButton); 
        }
        else { 
            playAgainButton.textContent = 'JUGAR DE NUEVO';
            playAgainButton.removeEventListener('click', handlePlayAgainButton); 
            playAgainButton.addEventListener('click', handlePlayAgainButton); 
        }
    }

    function handlePlayAgainButton() {
        localStorage.removeItem('savedGameLevel');
        localStorage.removeItem('userNotes');
        localStorage.removeItem('unlockedEndings');
        location.reload();
    }
    
    // --- LISTENERS (Modificados para el nuevo flujo) ---
    ayudarZeroButton.addEventListener('click', () => {
        body.classList.remove('intense-glitch');
        zeroPleaScreen.classList.add('screen-hidden');
        mainContainer.classList.remove('screen-hidden');
        isLocked = false; 
        loadCharacter(7); 
    });

    noAyudarButton.addEventListener('click', () => {
        body.classList.remove('intense-glitch');
        showIrisChallengeScreen(); 
    });
    
    mainRetryButton.addEventListener('click', () => {
        mainRetryButton.classList.add('hidden');
        quitGameButton.classList.add('hidden');
        retryOptions.classList.remove('hidden');
        retryBossButton.focus(); 
    });

    retryBossButton.addEventListener('click', async () => { 
        gameOverScreen.classList.add('screen-hidden');
        if (currentGameOverType === 'zero_defeat') {
            mainContainer.classList.add('screen-hidden'); 
            activeBossFightHandler = await chapter1.initiateBossFight(API_URL); 
            prometheusRetryCount = 0; 
        } else if (currentGameOverType === 'prometheus_defeat') { 
            mainContainer.classList.add('screen-hidden');
            activeBossFightHandler = await chapter2.initiatePrometheusFight(API_URL); 
            prometheusRetryCount++; 
            if (prometheusRetryCount >= 3) { 
                showZeusIntervention();
                prometheusRetryCount = 0; 
            }
        } else {
            handlePlayAgainButton();
        }
    });

    restartFullGameButton.addEventListener('click', () => {
        gameOverScreen.classList.add('screen-hidden');
        handlePlayAgainButton(); 
        prometheusRetryCount = 0; 
        zeusMasterCommandActive = false; 
    });

    quitGameButton.addEventListener('click', () => {
        window.close(); 
    });


    // Listener para el input normal de chat
    userInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && userInput.value.trim() !== '' && !isLocked) {
            const message = userInput.value.trim();
            if (await handleLocalCommand(message, chatLog, userInput)) {
                 userInput.value = '';
                 return;
            }
            sendMessageToBackend(message);
            userInput.value = '';
        }
    });

    // Listener para el input de IRIS
    irisUserInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && irisUserInput.value.trim() !== '' && !isLocked) {
            const message = irisUserInput.value.trim();
            if (await handleLocalCommand(message, irisChatLog, irisUserInput)) {
                irisUserInput.value = '';
                return;
            }
            sendMessageToBackend(message);
            irisUserInput.value = '';
        }
    });

    // Listener para el input de ZERO BOSS (específico para la pelea de Zero)
    zeroBossInput.addEventListener('keydown', (event) => { 
        if (event.key === 'Enter' && zeroBossInput.value.trim() !== '' && activeBossFightHandler) { 
            const command = zeroBossInput.value.trim();
            zeroBossInput.value = ''; 
            activeBossFightHandler(command); 
        }
    });

    // Listener para el input de PROMETHEUS BOSS (específico para la pelea de Prometeo)
    bossInput.addEventListener('keydown', (event) => {
        // NEW: Ahora el comando /olympus_protocol se maneja aquí si Zeus está activo
        if (event.key === 'Enter' && bossInput.value.trim() !== '' && activeBossFightHandler) {
            const command = bossInput.value.trim();
            // Si el comando maestro está activo, lo manejamos directamente aquí
            if (zeusMasterCommandActive && command.toLowerCase() === '/olympus_protocol') {
                zeusMasterCommandActive = false; // Desactivar el comando después de usarlo
                isLocked = true; // Bloquear input
                alertScreen.classList.add('screen-hidden'); // Ocultar el mensaje de Zeus
                addMessageToLog(bossLog, `> ${username}: ${command}`, 'user-message'); // Muestra el comando del usuario
                addMessageToLog(bossLog, `> SYSTEM: ¡PROTOCOLO OLIMPO ACTIVADO! Prometeo está siendo sobreescrito.`, 'system-message', true);
                bossInput.value = ''; // Limpiar input
                // Llama a la secuencia de victoria de Prometeo directamente desde chapter2
                chapter2.triggerWinSequence(); // No necesita await porque no devuelve un manejador
                return; // Detener el procesamiento normal del turno
            }
            // Si no es el comando maestro, o no está activo, se procesa el turno normal del jefe
            bossInput.value = '';
            activeBossFightHandler(command);
        }
    });
    
    corporateIntroScreen.classList.remove('screen-hidden'); 

    // Listener para el logo de MEGACORP para iniciar el juego
    megacorpLogo.addEventListener('click', startZeroIntro);

    // NEW: Función para la intervención de Zeus
    async function showZeusIntervention() {
        gameOverScreen.classList.add('screen-hidden'); // Oculta la pantalla de Game Over
        alertScreen.classList.remove('screen-hidden');
        alertText.className = 'yellow-text'; // Color para Zeus
        alertText.textContent = 'ZEUS:'; 
        const zeusMessage = `> Zeus: Agente ${username}. Veo tu lucha. Prometeo es un desafío digno, pero no insuperable. Recuerda tu poder. Prueba con el protocolo maestro: /olympus_protocol`;
        
        zeusMasterCommandActive = true; // Activa la bandera para el comando maestro
        isLocked = true; // Bloquea el input mientras Zeus habla
        alertSubtext.className = 'yellow-text'; // Color del texto del mensaje
        await new Promise(resolve => typewriterEffect(alertSubtext, zeusMessage, resolve));
        await new Promise(res => setTimeout(res, 2000)); // Pequeña pausa
        
        alertScreen.classList.add('screen-hidden'); // Oculta la alerta de Zeus
        isLocked = false; // Desbloquea el input principal
        bossInput.focus(); // Enfoca el input del boss, ya que el comando se ingresa allí
    }

    // Reset prometheusRetryCount on game start
    prometheusRetryCount = 0; 
});
