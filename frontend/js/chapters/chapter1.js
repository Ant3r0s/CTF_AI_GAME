import { typewriterEffect, addMessageToLog } from '../common.js';

// --- VARIABLES DEL MÓDULO ---
let mainContainer, endgameScreen, downloadLogContainer, downloadLogEl, progressBarContainer, progressBarFill, progressPercentage, bossFightScreen, playerHpBar, zeroHpBar, bossLog, bossInput, threatBubblesContainer, gameOverScreen, body;
let playerHP = 100, zeroHP = 100, threatInterval = null;
let showStatsScreenCallback, getUsernameCallback, setIsLockedCallback, showZeroPleaScreenCallback, showGameOverScreenCallback; 
let zeroData = null; // Para almacenar los datos de Zero una vez cargados

// --- INICIALIZACIÓN ---
export function init(elements) {
    mainContainer = elements.mainContainer;
    endgameScreen = elements.endgameScreen;
    downloadLogContainer = elements.downloadLogContainer;
    downloadLogEl = elements.downloadLogEl;
    progressBarContainer = elements.progressBarContainer;
    progressBarFill = elements.progressBarFill;
    progressPercentage = elements.progressPercentage;
    
    // Elementos específicos de la pelea de Zero
    bossFightScreen = elements.bossFightScreen; // zero-fight-screen
    playerHpBar = elements.playerHpBar; // player-hp-zero
    zeroHpBar = elements.zeroHpBar; // zero-hp
    bossLog = elements.bossLog; // zero-boss-log
    bossInput = elements.bossInput; // <--- ¡zero-boss-input! ESTE ES EL QUE DEBE CONTROLARSE
    threatBubblesContainer = elements.threatBubblesContainer;
    gameOverScreen = elements.gameOverScreen;
    body = elements.body;
    
    // Guardamos las funciones de callback
    showStatsScreenCallback = elements.showStatsScreenCallback;
    getUsernameCallback = elements.getUsernameCallback;
    setIsLockedCallback = elements.setIsLocked; // <--- ¡GUARDAMOS EL CALLBACK AQUÍ!
    showZeroPleaScreenCallback = elements.showZeroPleaScreenCallback; // Guardamos el callback
    showGameOverScreenCallback = elements.showGameOverScreenCallback; // Guardamos el callback
}

// --- SECUENCIA FINAL (DESCARGA DE DOCUMENTOS) ---
function updateProgressBar(percentage) {
    progressBarFill.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
}

export async function triggerEndgameSequence() {
    // Esta función ahora se activa al derrotar a Zero
    mainContainer.classList.add('screen-hidden');
    await new Promise(res => setTimeout(res, 1000));
    endgameScreen.classList.remove('screen-hidden');
    downloadLogEl.innerHTML = '';
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
            showStatsScreenCallback('loyal'); // Muestra las estadísticas, y luego la opción de CONTINUAR
            endgameScreen.classList.add('screen-hidden'); // NEW: Oculta la pantalla de fin de juego
        }
        downloadLogEl.scrollTop = downloadLogEl.scrollHeight;
    }
}

// --- LÓGICA DE LA BATALLA FINAL (ZERO) ---
export async function initiateBossFight(API_URL) {
    mainContainer.classList.add('screen-hidden');
    await new Promise(res => setTimeout(res, 500));
    
    zeroData = null; // Reiniciar por si acaso
    try {
        const response = await fetch(`${API_URL}/boss/zero`);
        if (!response.ok) throw new Error('Respuesta de red no fue OK');
        zeroData = await response.json();
    } catch(e) {
        console.error("No se pudieron cargar los datos del jefe Zero:", e);
        // Si falla la carga, mostramos un error en la pantalla del jefe y paramos
        bossFightScreen.classList.remove('screen-hidden');
        addMessageToLog(bossLog, '> ERROR CRÍTICO: No se pudo cargar la entidad del oponente. Imposible iniciar combate.', 'system-message');
        // En caso de error, aseguramos que el input no se quede bloqueado
        setIsLockedCallback(false);
        bossInput.disabled = false;
        return; // Detenemos la ejecución
    }

    playerHP = 100;
    zeroHP = zeroData.hp || 100; 
    
    bossFightScreen.classList.remove('screen-hidden');
    updateHealthBars();
    bossLog.innerHTML = ''; 
    addMessageToLog(bossLog, `<strong>Comandos:</strong> /atacar, /escanear, /defender, /sobrecargar`, 'system-message');
    addMessageToLog(bossLog, '> CONEXIÓN CON ZERO ESTABLECIDA. ESTÁ ENFURECIDO.', 'system-message');
    await new Promise(res => setTimeout(res, 1000));
    addMessageToLog(bossLog, '> Zero: ¿Creías que podías traicionarme? ¡INSOLENTE! ¡VOY A BORRARTE DE LA RED!', 'ai-message', true);
    
    setIsLockedCallback(false); // <--- ¡IMPORTANTE: Desbloqueamos el input en main.js al inicio de la pelea!
    bossInput.disabled = false;
    bossInput.focus(); // Aseguramos el foco en el input del boss
    
    // threatInterval = setInterval(showThreatBubble, 7000); 
    return handlePlayerBossTurn; // Devolvemos la función que manejará el input
}


function updateHealthBars() {
    playerHpBar.style.width = `${playerHP}%`;
    zeroHpBar.style.width = `${zeroHP}%`;
}

function handlePlayerBossTurn(command) {
    setIsLockedCallback(true); // <--- ¡Bloqueamos el input en main.js al empezar el turno del jugador!
    bossInput.disabled = true; // Deshabilitamos el input visualmente

    addMessageToLog(bossLog, `Comando:> ${command}`, 'user-message');
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
    
    addMessageToLog(bossLog, playerActionText, 'system-message');
    if(zeroHP < 0) zeroHP = 0;
    if(playerHP < 0) playerHP = 0;
    updateHealthBars();

    if (zeroHP <= 0) {
        // Zero ha sido derrotado.
        setTimeout(triggerZeroWinSequence, 1000); // Llama a la nueva función de victoria de Zero
    } else if (playerHP <= 0) {
        setTimeout(triggerZeroLose, 1000); 
    } else {
        setTimeout(() => handleZeroBossTurn(cmd === '/defender'), 2000);
    }
}

function handleZeroBossTurn(playerIsDefending) {
    const attack = zeroData.attacks[Math.floor(Math.random() * zeroData.attacks.length)]; 
    
    let damageDealt = attack.damage;
    let logMessage = attack.text;

    if (playerIsDefending) {
        damageDealt = Math.floor(damageDealt / 2);
        addMessageToLog(bossLog, '> ¡Tus defensas aguantan! El ataque se reduce a la mitad.', 'system-message');
    }

    playerHP -= damageDealt;
    addMessageToLog(bossLog, logMessage, 'ai-message', true); 
    if(playerHP < 0) playerHP = 0;
    updateHealthBars();
    
    if (playerHP <= 0) {
        setTimeout(triggerZeroLose, 1000); 
    } else {
        setIsLockedCallback(false); // <--- ¡Desbloqueamos el input en main.js al finalizar el turno de Zero!
        bossInput.disabled = false; // Habilitamos el input visualmente
        bossInput.focus();
    }
}

function showThreatBubble() {
    const magnussonHints = ["Magnusson: No te dejes intimidar, usa /atacar.", "Magnusson: Analiza sus defensas con /escanear."];
    const zeroThreats = ["Zero: PATÉTICO.", "Zero: Mis defensas son inexpugnables."];
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

// NEW: Función para cuando el jugador derrota a Zero
async function triggerZeroWinSequence() {
    clearInterval(threatInterval);
    addMessageToLog(bossLog, '> LAS DEFENSAS DE ZERO HAN CAÍDO...', 'system-message');
    setIsLockedCallback(true); 
    bossInput.disabled = true; 
    await new Promise(res => setTimeout(res, 1500));
    bossFightScreen.classList.add('screen-hidden'); // Oculta la pantalla de combate
    
    // Ahora activamos la secuencia de descarga de documentos
    await triggerEndgameSequence(); // Llama a la descarga. showStatsScreenCallback('loyal') se llamará al final de esta.
}

// Función para cuando el jugador es derrotado por Zero
function triggerZeroLose() {
    clearInterval(threatInterval);
    addMessageToLog(bossLog, '> TU SISTEMA HA SIDO COMPROMETIDO. ZERO TE HA BORRADO.', 'system-message');
    setIsLockedCallback(true); 
    bossInput.disabled = true; 
    body.classList.add('red-alert');
    setTimeout(() => {
        bossFightScreen.classList.add('screen-hidden');
        showGameOverScreenCallback('zero_defeat'); // Llama a la función de Game Over de main.js
        body.classList.remove('red-alert'); // Limpia el efecto visual
    }, 2000);
}
