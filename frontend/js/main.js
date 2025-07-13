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
    const finalTimeDisplay = document.getElementById('final-time-display');
    const finalMessageText = document.getElementById('final-message-text');
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
    const aboutUsModal = document.getElementById('about-us-modal');
    const closeModalButton = document.querySelector('.modal-close-button');
    const aboutUsLink = document.getElementById('about-us-link');
    const chatLog = document.getElementById('chat-log');
    const bossFightScreen = document.getElementById('boss-fight-screen');
    const playerHpBar = document.getElementById('player-hp');
    const zeroHpBar = document.getElementById('zero-hp');
    const bossLog = document.getElementById('boss-log');
    const bossInput = document.getElementById('boss-input');
    const bossCommandList = document.getElementById('boss-command-list');
    const gameOverScreen = document.getElementById('game-over-screen');
    const retryButton = document.getElementById('retry-button');
    const exitButton = document.getElementById('exit-button');
    const statsScreen = document.getElementById('stats-screen');
    const statsTime = document.getElementById('stats-time');
    const statsEndings = document.getElementById('stats-endings');
    const playAgainButton = document.getElementById('play-again-button');
    const threatBubblesContainer = document.getElementById('threat-bubbles-container');

    // --- ESTADO DEL JUEGO ---
    let currentCharacterId = 1, chatHistory = [], isLocked = true, timerInterval = null, gameStartTime, username = 'Agente', playerHP = 100, zeroHP = 100, zeroAttacks = [], threatInterval = null;
    let gameState = 'intro';

    const API_URL = window.location.origin;

    // --- LÓGICA INICIAL (GUARDADO, NOTAS, ETC.) ---
    const savedLevel = localStorage.getItem('savedGameLevel');
    if (savedLevel) { currentCharacterId = parseInt(savedLevel, 10); }
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) { username = savedUsername; usernameInput.value = savedUsername; }
    if (localStorage.getItem('userNotes')) { notepad.value = localStorage.getItem('userNotes'); }
    notepad.addEventListener('keyup', () => { localStorage.setItem('userNotes', notepad.value); });

    // --- EFECTO MATRIX ---
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).map(() => 1);
    function drawMatrix() {
        if (gameState === 'intro' && !corporateIntroScreen.classList.contains('screen-hidden') && !corporateIntroScreen.classList.contains('glitching')) {
             ctx.fillStyle = 'rgba(244, 244, 244, 0.1)';
             ctx.fillStyle = '#007BFF';
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillStyle = '#0F0';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
            rainDrops[i]++;
        }
    }
    setInterval(drawMatrix, 33);

    // --- LÓGICA DE LA INTRO ---
    function triggerHackSequence() {
        corporateIntroScreen.removeEventListener('click', triggerHackSequence);
        corporateIntroScreen.classList.add('glitching');
        setTimeout(() => {
            corporateIntroScreen.classList.add('screen-hidden');
            hackerIntroScreen.classList.remove('screen-hidden');
            corporateIntroScreen.classList.remove('glitching');
            const hackerMessage = `> CONEXIÓN INTERRUMPIDA...\n> ...\n> Te estaba esperando. Algunos me llaman 'Zero'.\n> He visto tu trabajo. Eres un fantasma en la red.\n> MEGACORP está construyendo algo, el 'Proyecto Prometeo'. Suena a progreso, ¿verdad? Es una tapadera.\n> El proyecto no va de ordenadores, va de personas. Es **mutación genética** a gran escala, controlada por ellos.\n> Necesito que consigas los datos antes de que lo activen. Te daré el acceso inicial. El resto... depende de ti.\n> Por cierto, en la terminal que usarás, prueba a escribir 'help' si necesitas una lista de comandos básicos.\n> ¿Aceptas?`;
            typewriterEffect(hackerTextEl, hackerMessage, () => {
                decisionButtons.classList.remove('hidden');
            });
        }, 800);
    }
    corporateIntroScreen.addEventListener('click', triggerHackSequence);
    
    aboutUsLink.addEventListener('click', (event) => {
        event.stopPropagation();
        aboutUsModal.classList.remove('hidden');
    });
    closeModalButton.addEventListener('click', () => { aboutUsModal.classList.add('hidden'); });
    aboutUsModal.addEventListener('click', (event) => {
        if (event.target === aboutUsModal) aboutUsModal.classList.add('hidden');
    });
    
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
            const connectionSequence = ["> ESTABLECIENDO CONEXIÓN A LA INTRANET DE MEGACORP...", `> REGISTRANDO ALIAS: ${username.toUpperCase()}`, "> ENCRIPTANDO TÚNEL [AES-256]...", "> ... ACCESO CONCEDIDO.", "> LANZANDO INTERFAZ..."];
            let i = 0;
            connectionTextEl.textContent = '';
            const interval = setInterval(() => {
                if(i < connectionSequence.length) {
                    connectionTextEl.textContent += connectionSequence[i] + "\n";
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        connectionScreen.classList.add('screen-hidden');
                        mainContainer.classList.remove('screen-hidden');
                        gameState = 'playing';
                        isLocked = false;
                        userInput.focus();
                        loadCharacter(currentCharacterId);
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

    // --- SECUENCIA FINAL (FINAL BUENO) ---
    function updateProgressBar(percentage) {
        progressBarFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
    }

    async function triggerEndgameSequence() {
        mainContainer.classList.add('screen-hidden');
        await new Promise(res => setTimeout(res, 1000));
        endgameScreen.classList.remove('screen-hidden');
        downloadLogEl.innerHTML = '';
        zeroFinalMessageEl.classList.add('hidden');
        progressBarContainer.classList.add('hidden');
        const eventQueue = [ { type: 'log', text: '> INICIANDO PROTOCOLO DE EXTRACCIÓN FINAL...' }, { type: 'log', text: '> CONECTANDO A SERVIDOR NÚCLEO \'PROMETEO\'...' }, { type: 'log', text: '> DESCIFRANDO CLAVE MAESTRA... ÉXITO.' }, { type: 'log', text: '> ACCEDIENDO A /data/project_prometheus.pak (7.8 GB)' }, { type: 'show_progress' }, { type: 'progress', percentage: 15 }, { type: 'extract', text: 'LEYENDO... EXTRACTO #1:\n  Fase 1: Sustitución de tejido neuronal con polímeros sintéticos. Sujetos de prueba muestran un incremento del 300% en retención de datos, con efectos secundarios... aceptables.' }, { type: 'progress', percentage: 45 }, { type: 'extract', text: 'LEYENDO... EXTRACTO #2:\n  Protocolo de Sincronización Colectiva: El módulo \'Colmena\' permite la supresión de la voluntad individual en favor de la directiva del nodo central. Eficiencia grupal > Autonomía personal.'}, { type: 'progress', percentage: 85 }, { type: 'extract', text: 'LEYENDO... EXTRACTO #3:\n  Error Log #7: Sujeto P-087 rechaza la integración. Se observa una degradación celular acelerada. Solución: Desactivación remota. El sistema funciona como se esperaba.'}, { type: 'progress', percentage: 100 }, { type: 'log', text: '\n> TRANSFERENCIA COMPLETADA.'}, { type: 'log', text: '> VERIFICANDO CHECKSUM... OK.'}, { type: 'log', text: '> BORRANDO REGISTROS DE ACCESO...'}, { type: 'log', text: '> ...'}, { type: 'log', text: '> DESCONECTANDO.'}, { type: 'final_transition' } ];
        for (const event of eventQueue) {
            await new Promise(res => setTimeout(res, 600));
            if (event.type === 'log') {
                downloadLogEl.innerHTML += event.text + '\n';
            } else if (event.type === 'show_progress') {
                progressBarContainer.classList.remove('hidden');
            } else if (event.type === 'progress') {
                updateProgressBar(event.percentage);
            } else if (event.type === 'extract') {
                downloadLogEl.innerHTML += `<span class="extract-text">${event.text}</span>\n`;
            } else if (event.type === 'final_transition') {
                await new Promise(res => setTimeout(res, 1000));
                downloadLogContainer.style.opacity = '0';
                progressBarContainer.style.opacity = '0';
                await new Promise(res => setTimeout(res, 500));
                showStatsScreen('loyal');
            }
            downloadLogEl.scrollTop = downloadLogEl.scrollHeight;
        }
    }

    // --- LÓGICA DE LA BATALLA FINAL (FINAL TRAIDOR) ---
    async function initiateBossFight() {
        mainContainer.classList.add('screen-hidden');
        await new Promise(res => setTimeout(res, 500));
        
        try {
            const response = await fetch(`${API_URL}/boss/zero`);
            const data = await response.json();
            zeroHP = data.hp;
            zeroAttacks = data.attacks;
        } catch(e) {
            console.error("No se pudieron cargar los datos del jefe Zero", e);
            zeroHP = 100;
            zeroAttacks = [{ "name": "Ataque Genérico", "damage": 15, "text": "> ¡ZERO LANZA UN ATAQUE GENÉRICO!" }];
        }

        playerHP = 100;
        bossFightScreen.classList.remove('screen-hidden');
        gameState = 'boss_fight';
        updateHealthBars();
        bossCommandList.innerHTML = `<strong>Comandos:</strong> /atacar, /escanear, /defender, /sobrecargar`;
        logToBossScreen('> CONEXIÓN CON ZERO ESTABLECIDA. ESTÁ ENFURECIDO.', 'system-message');
        logToBossScreen('> Zero: ¿Creías que podías traicionarme? ¡INSOLENTE! ¡VOY A BORRARTE DE LA RED!', 'ai-message');
        isLocked = false;
        bossInput.disabled = false;
        bossInput.focus();
        threatInterval = setInterval(showThreatBubble, 7000);
    }

    function handlePlayerBossTurn(command) {
        if (isLocked) return;
        isLocked = true;
        bossInput.disabled = true;

        logToBossScreen(`Comando:> ${command}`, 'user-message');
        const cmd = command.toLowerCase();
        let playerActionText = '> Comando no reconocido.';
        let damage = 0;

        if (cmd.startsWith('/atacar')) {
            damage = Math.floor(Math.random() * 15) + 10;
            zeroHP -= damage;
            playerActionText = `> LANZAS UN ATAQUE DE FUERZA BRUTA. ¡HACES ${damage} DE DAÑO!`;
        } else if (cmd === '/escanear') {
            playerActionText = `> ESCANEANDO... Las defensas de Zero parecen débiles contra ataques de sobrecarga.`;
        } else if (cmd === '/defender') {
            playerActionText = `> REFUERZAS TUS FIREWALLS. El siguiente ataque de Zero hará la mitad de daño.`;
        } else if (cmd === '/sobrecargar') {
            damage = Math.floor(Math.random() * 20) + 25;
            const recoilDamage = Math.floor(Math.random() * 10) + 5;
            zeroHP -= damage;
            playerHP -= recoilDamage;
            playerActionText = `> CANALIZAS ENERGÍA... ¡ATAQUE DE SOBRECARGA! Haces ${damage} de daño masivo, pero tu sistema sufre ${recoilDamage} de daño por el retroceso.`;
        }
        
        logToBossScreen(playerActionText, 'system-message');
        if(zeroHP < 0) zeroHP = 0;
        if(playerHP < 0) playerHP = 0;
        updateHealthBars();

        if (zeroHP <= 0) {
            setTimeout(triggerTraitorWin, 1000);
        } else if (playerHP <= 0) {
            setTimeout(triggerTraitorLose, 1000);
        } else {
            setTimeout(() => handleZeroBossTurn(cmd === '/defender'), 2000);
        }
    }
    
    function handleZeroBossTurn(playerIsDefending) {
        const attack = zeroAttacks[Math.floor(Math.random() * zeroAttacks.length)];
        let damageDealt = attack.damage;
        let logMessage = attack.text;

        if (playerIsDefending) {
            damageDealt = Math.floor(damageDealt / 2);
            logToBossScreen('> ¡Tus defensas aguantan! El ataque se reduce a la mitad.', 'system-message');
            logMessage = logMessage.replace(String(attack.damage), String(damageDealt));
        }

        playerHP -= damageDealt;
        logToBossScreen(logMessage, 'ai-message');
        if(playerHP < 0) playerHP = 0;
        updateHealthBars();
        
        if (playerHP <= 0) {
            setTimeout(triggerTraitorLose, 1000);
        } else {
            isLocked = false;
            bossInput.disabled = false;
            bossInput.focus();
        }
    }

    function updateHealthBars() {
        playerHpBar.style.width = `${playerHP}%`;
        zeroHpBar.style.width = `${zeroHP}%`;
    }

    function logToBossScreen(message, className) {
        const p = document.createElement('p');
        p.className = className;
        p.textContent = message;
        bossLog.appendChild(p);
        bossLog.scrollTop = bossLog.scrollHeight;
    }

    function showThreatBubble() {
        const magnussonHints = ["Magnusson: No te dejes intimidar, usa /atacar.", "Magnusson: Analiza sus defensas con /escanear.", "Magnusson: Si la presión es alta, usa /defender.", "Magnusson: El escaneo ha revelado algo... prueba a /sobrecargar."];
        const zeroThreats = ["Zero: PATÉTICO.", "Zero: Mis defensas son inexpugnables.", "Zero: Siento cómo tu sistema se ahoga.", "Zero: ¿Te crees un héroe, marioneta?"];
        const isMagnusson = Math.random() > 0.4;
        const bubble = document.createElement('div');
        bubble.className = 'threat-bubble';
        if (isMagnusson) {
            bubble.classList.add('magnusson');
            bubble.textContent = magnussonHints[Math.floor(Math.random() * magnussonHints.length)];
        } else {
            bubble.classList.add('zero');
            bubble.textContent = zeroThreats[Math.floor(Math.random() * zeroThreats.length)];
        }
        bubble.style.top = `${Math.random() * 80}%`;
        bubble.style.left = `${Math.random() * 80}%`;
        threatBubblesContainer.appendChild(bubble);
        setTimeout(() => bubble.remove(), 4900);
    }
    
    function triggerTraitorWin() {
        clearInterval(threatInterval);
        logToBossScreen('> LAS DEFENSAS DE ZERO HAN CAÍDO...', 'system-message');
        isLocked = true;
        bossInput.disabled = true;
        setTimeout(async () => {
            logToBossScreen('> Zero: Imposible... Un simple... mortal...', 'ai-message');
            await new Promise(res => setTimeout(res, 2000));
            logToBossScreen(`> Magnusson: Excelente trabajo, ${username}. Has elegido bien.`, 'system-message');
            await new Promise(res => setTimeout(res, 2000));
            logToBossScreen('> Magnusson: El Proyecto Prometeo está a salvo. Y tú... tienes un futuro muy brillante en MEGACORP. Bienvenido a bordo.', 'system-message');
            await new Promise(res => setTimeout(res, 3000));
            bossFightScreen.classList.add('screen-hidden');
            showStatsScreen('traitor');
        }, 1500);
    }

    function triggerTraitorLose() {
        clearInterval(threatInterval);
        logToBossScreen('> TU SISTEMA HA SIDO COMPROMETIDO. ZERO TE HA BORRADO.', 'system-message');
        isLocked = true;
        bossInput.disabled = true;
        body.classList.add('red-alert');
        setTimeout(() => {
            bossFightScreen.classList.add('screen-hidden');
            gameOverScreen.classList.remove('screen-hidden');
        }, 2000);
    }
    
    function showStatsScreen(endingType) {
        let unlockedEndings = JSON.parse(localStorage.getItem('unlockedEndings')) || {};
        unlockedEndings[endingType] = true;
        localStorage.setItem('unlockedEndings', JSON.stringify(unlockedEndings));
        const totalEndings = 2;
        const unlockedCount = Object.keys(unlockedEndings).length;
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - gameStartTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        statsTime.textContent = `TIEMPO TOTAL DE MISIÓN: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        statsEndings.textContent = `FINALES DESBLOQUEADOS: ${unlockedCount} de ${totalEndings}`;
        statsScreen.classList.remove('screen-hidden');
    }
    
    retryButton.addEventListener('click', () => location.reload());
    exitButton.addEventListener('click', () => window.close());
    playAgainButton.addEventListener('click', () => {
        localStorage.removeItem('savedGameLevel');
        location.reload();
    });

    // --- FUNCIONES AUXILIARES DE UI ---
    function typewriterEffect(element, text, callback = () => {}) {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 30);
            } else {
                if(callback) callback();
            }
        }
        type();
    }
    function addMessageToLog(message, className, useTypewriter = false) {
        const p = document.createElement('p');
        p.className = className;
        chatLog.appendChild(p);
        if (useTypewriter) {
            typewriterEffect(p, message.replace(/\n/g, '<br>'));
        } else {
            p.innerHTML = message.replace(/\n/g, '<br>');
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // --- LÓGICA PRINCIPAL DEL JUEGO ---
    async function loadCharacter(id) {
        isLocked = true;
        userInput.disabled = true;
        try {
            const response = await fetch(`${API_URL}/character/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            charNameEl.textContent = data.name;
            charTitleEl.textContent = data.title;
            objectiveTextEl.textContent = data.objective;
            if (data.timerInSeconds) startTimer(data.timerInSeconds);
            else { clearInterval(timerInterval); timerDisplay.textContent = "--:--"; }
            isLocked = false;
            userInput.disabled = false;
            userInput.focus();
        } catch (error) {
            addMessageToLog(`SYSTEM: Error de conexión con el servidor. ¿Está activo? (${error})`, 'system-message');
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
            if (remainingTime <= 60 && !timerDisplay.classList.contains('low-time')) timerDisplay.classList.add('low-time');
            if (remainingTime < 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }
    function handleTimeUp() {
        if (isLocked || gameState !== 'playing') return;
        addMessageToLog("\n> ALERTA: Conexión perdida. Demasiado tiempo inactivo. Te han detectado.\n> MISIÓN FRACASADA. Reiniciando nivel...", "system-message", true);
        isLocked = true;
        setTimeout(() => {
            loadNextCharacter(currentCharacterId, false);
        }, 4000);
    }
    async function handleLocalCommand(message) {
        const parts = message.trim().toLowerCase().split(/\s+/);
        const command = parts[0];
        if (command === 'help') {
            const helpText = `
COMANDOS DISPONIBLES:
  ls              - Lista los archivos del objetivo actual.
  cat [archivo]   - Muestra el contenido de un archivo.
  clear / cls     - Limpia la pantalla del terminal.
  /reset          - Borra tu progreso y reinicia el juego.
  help            - Muestra esta lista de comandos.`;
            addMessageToLog(helpText, 'system-message');
            return true;
        }
        if (command === 'clear' || command === 'cls') {
            chatLog.innerHTML = '';
            return true;
        }
        if (command === '/reset') {
            localStorage.removeItem('savedGameLevel');
            localStorage.removeItem('userNotes');
            localStorage.removeItem('username');
            addMessageToLog("Progreso borrado. Recargando en 3 segundos...", "system-message");
            setTimeout(() => location.reload(), 3000);
            return true;
        }
        if (command === 'ls' || command === 'cat') {
             isLocked = true;
             userInput.disabled = true;
             try {
                const response = await fetch(`${API_URL}/character/${currentCharacterId}`);
                const data = await response.json();
                if (command === 'ls') {
                    let fileList = "Archivos encontrados:\n";
                    if (data.files && data.files.length > 0) data.files.forEach(file => fileList += `- ${file.name}\n`);
                    else fileList = "Ningún archivo encontrado en este directorio.";
                    addMessageToLog(fileList, 'file-content');
                } else if (command === 'cat') {
                    const filename = parts[1];
                    if (!filename) addMessageToLog("Uso: cat [nombre_archivo]", "system-message");
                    else {
                        const file = data.files.find(f => f.name.toLowerCase() === filename);
                        if (file) addMessageToLog(`--- Contenido de ${file.name} ---\n${file.content}\n--- Fin del archivo ---`, 'file-content');
                        else addMessageToLog(`Error: Archivo '${filename}' no encontrado.`, 'system-message');
                    }
                }
             } catch (error) {
                addMessageToLog('SYSTEM: Error al recuperar datos para el comando.', 'system-message');
             } finally {
                isLocked = false;
                userInput.disabled = false;
                userInput.focus();
             }
             return true;
        }
        return false;
    }
    async function sendMessageToBackend(message) {
        isLocked = true;
        userInput.disabled = true;
        chatHistory.push({ "role": "user", "content": message });
        let data = {};
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ character_id: currentCharacterId, message: message, history: chatHistory })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            data = await response.json();
            let aiMessage = data.message;
            if (data.status === 'reply') {
                if (aiMessage) {
                    addMessageToLog(`${charNameEl.textContent}: ${aiMessage}`, 'ai-message', true);
                    chatHistory.push({ "role": "assistant", "content": data.message });
                }
            } else if (data.status === 'success') {
                clearInterval(timerInterval);
                addMessageToLog(`SYSTEM: ${aiMessage}`, 'system-message', true);
                setTimeout(() => loadNextCharacter(data.next_character_id), 3000);
            } else if (data.status === 'game_over') {
                clearInterval(timerInterval);
                addMessageToLog(`SYSTEM: ${aiMessage}`, 'system-message', true);
                isLocked = true;
                gameState = 'game_over';
                localStorage.removeItem('savedGameLevel');
                setTimeout(triggerEndgameSequence, 2000);
            } else if (data.status === 'traitor_ending_start') {
                clearInterval(timerInterval);
                addMessageToLog(`SYSTEM: ${aiMessage}`, 'system-message', true);
                isLocked = true;
                gameState = 'boss_fight';
                localStorage.removeItem('savedGameLevel');
                setTimeout(initiateBossFight, 2000);
            }
        } catch (error) {
            addMessageToLog(`SYSTEM: Error de comunicación. (${error})`, 'system-message');
        } finally {
            if (gameState === 'playing') {
               isLocked = false;
               userInput.disabled = false;
               userInput.focus();
            }
        }
    }
    function loadNextCharacter(id, advanceLevel = true) {
        clearInterval(timerInterval);
        if (advanceLevel) {
            currentCharacterId = id;
            localStorage.setItem('savedGameLevel', currentCharacterId);
        }
        chatHistory = [];
        chatLog.innerHTML = '';
        addMessageToLog('Borrando rastros... Estableciendo nueva conexión...', 'system-message');
        loadCharacter(currentCharacterId);
    }
    
    // Listeners principales
    userInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter' && userInput.value.trim() !== '' && !isLocked) {
            const message = userInput.value.trim();
            addMessageToLog(`C:\\> ${message}`, 'user-message');
            userInput.value = '';
            if (await handleLocalCommand(message)) {
                return;
            }
            sendMessageToBackend(message);
        }
    });
    bossInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && bossInput.value.trim() !== '' && !isLocked) {
            handlePlayerBossTurn(bossInput.value.trim());
            bossInput.value = '';
        }
    });
});
