import { addMessageToLog, typewriterEffect } from '../common.js';

// --- VARIABLES DEL MÓDULO DE BATALLA ---
let playerHP = 100;
let playerIntegrity = 100;
let prometheusHP = 150;
let prometheusData = {};
let isLocked = false; 
let crisisActive = false;
let activeCrisis = null;
let crisisTurnsLeft = 0;
let playerIsDefending = false;
let prometheusPhase = 1;

// Referencias a elementos del DOM y callbacks
let bossFightScreen, playerHpBar, playerIntegrityBar, prometheusHpBar, bossLog, bossInput, bossCommandList, gameOverScreen, body, hud, showStatsScreenCallback, setIsLockedCallback, showPrometheusFinalDialogueCallback, showGameOverScreenCallback, setZeusMasterCommandActive, getZeusMasterCommandActive; // NEW: Callbacks para Zeus

export function init(elements) {
    bossFightScreen = elements.bossFightScreen;
    playerHpBar = elements.playerHpBar;
    playerIntegrityBar = document.getElementById('player-integrity');
    prometheusHpBar = document.getElementById('prometheus-hp');
    bossLog = elements.bossLog;
    bossInput = elements.bossInput;
    bossCommandList = elements.bossCommandList;
    gameOverScreen = elements.gameOverScreen;
    body = elements.body;
    hud = elements.hud;
    showStatsScreenCallback = elements.showStatsScreenCallback;
    setIsLockedCallback = elements.setIsLocked; 
    showPrometheusFinalDialogueCallback = elements.showPrometheusFinalDialogueCallback; 
    showGameOverScreenCallback = elements.showGameOverScreenCallback; 
    setZeusMasterCommandActive = elements.setZeusMasterCommandActive; // NEW: Guardamos el setter de Zeus
    getZeusMasterCommandActive = elements.getZeusMasterCommandActive; // NEW: Guardamos el getter de Zeus
}

export async function initiatePrometheusFight(API_URL) {
    try {
        const response = await fetch(`${API_URL}/boss/prometheus`);
        prometheusData = await response.json();
        prometheusHP = prometheusData.hp;
    } catch (e) { 
        console.error("Error cargando datos de Prometeo", e); 
        setIsLockedCallback(false);
        bossInput.disabled = false;
        return;
    }
    
    playerHP = 100;
    playerIntegrity = 100;
    prometheusPhase = 1;
    bossLog.innerHTML = '';
    
    updateHealthBars();
    bossCommandList.innerHTML = `<strong>Comandos:</strong> /corrupt_data, /patch_kernel, /execute_forkbomb, /analyze_protocols`;
    bossFightScreen.classList.remove('screen-hidden');

    addMessageToLog(bossLog, "> PROMETEO: Intruso detectado. Variable no autorizada en el núcleo.", 'ai-message', true);
    await new Promise(res => setTimeout(res, 2000));
    addMessageToLog(bossLog, "> PROMETEO: Eres una anomalía, un error en el sistema perfecto. Serás erradicado.", 'ai-message', true);
    await new Promise(res => setTimeout(res, 2000));

    setIsLockedCallback(false); 
    bossInput.disabled = false;
    bossInput.focus();
    return handlePlayerPrometheusTurn;
}

function triggerRandomEffect() {
    const chance = prometheusPhase === 1 ? 0.2 : (prometheusPhase === 2 ? 0.5 : 0.8); 
    if (Math.random() > chance) return;

    const roll = Math.random();
    if (roll < 0.33) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    } else if (roll < 0.66) {
        const staticEffect = document.createElement('div');
        staticEffect.className = 'static-overlay';
        body.appendChild(staticEffect);
        setTimeout(() => staticEffect.remove(), 700);
    } else {
        hud.classList.add('hud-glitch');
        setTimeout(() => hud.classList.remove('hud-glitch'), 500);
    }
}

function updateHealthBars() {
    const prometheusHpPercentage = (prometheusHP / prometheusData.hp) * 100;
    playerHpBar.style.width = `${playerHP}%`;
    prometheusHpBar.style.width = `${prometheusHpPercentage > 0 ? prometheusHpPercentage : 0}%`;
    playerIntegrityBar.style.width = `${playerIntegrity > 0 ? playerIntegrity : 0}%`;

    // LÓGICA DE CAMBIO DE FASE
    const hpRatio = prometheusHP / prometheusData.hp;
    if (hpRatio < 0.3 && prometheusPhase < 3) {
        prometheusPhase = 3;
        addMessageToLog(bossLog, '> PROMETEO: ¡BASTA! ¡DESTRUIRÉ ESTE NODO CONTIGO DENTRO!', 'ai-message red-alert', true);
        body.classList.add('critical-damage-effect');
    } else if (hpRatio < 0.7 && prometheusPhase < 2) {
        prometheusPhase = 2;
        addMessageToLog(bossLog, '> PROMETEO: Tu persistencia es... irritante.', 'ai-message', true);
    }
}

export function handlePlayerPrometheusTurn(command) { // Exportamos para que main.js pueda llamarla directamente con el comando maestro
    // NEW: Si el comando maestro de Zeus está activo, lo manejamos aquí
    if (getZeusMasterCommandActive() && command.toLowerCase() === '/olympus_protocol') {
        addMessageToLog(bossLog, `Comando:> ${command}`, 'user-message');
        addMessageToLog(bossLog, '> SYSTEM: ¡PROTOCOLO OLIMPO ACTIVADO! Prometeo está siendo sobreescrito.', 'system-message', true);
        setZeusMasterCommandActive(false); // Desactivar el comando después de usarlo
        setIsLockedCallback(true); // Bloquear input durante la secuencia de victoria
        bossInput.disabled = true;
        setTimeout(() => { // Pequeño delay para el mensaje antes de la victoria
            triggerWinSequence(); // Activa la secuencia de victoria
        }, 1500);
        return; // Detener el procesamiento normal del turno
    }

    setIsLockedCallback(true); 
    playerIsDefending = false;
    bossInput.disabled = true;
    addMessageToLog(bossLog, `Comando:> ${command}`, 'user-message');

    if (crisisActive) {
        handleCrisisCommand(command);
    } else {
        handleNormalCommand(command);

        if (prometheusHP <= 0) {
            triggerWinSequence();
        } else if (playerHP <= 0) {
            triggerLoseSequence();
        } else if (playerIntegrity <= 0) {
            handleIntegrityFailure();
        } else {
            setTimeout(() => handlePrometheusBossTurn(), 2000);
        }
    }
}


function handleNormalCommand(command) {
    const cmd = command.toLowerCase();
    let playerActionText = '> Comando no reconocido.';
    let damage = 0;

    if (cmd.startsWith('/corrupt_data')) {
        damage = Math.floor(Math.random() * 15) + 12;
        prometheusHP -= damage;
        playerActionText = `> Inyectas datos corruptos en el núcleo. ¡Haces ${damage} de daño!`;
    } else if (cmd === '/patch_kernel') {
        const integrityRestored = Math.floor(Math.random() * 10) + 10;
        playerIntegrity += integrityRestored;
        if (playerIntegrity > 100) playerIntegrity = 100;
        playerIsDefending = true;
        playerActionText = `> Recompilas tu kernel. Recuperas ${integrityRestored}% de integridad y refuerzas tus defensas para el siguiente golpe.`;
    } else if (cmd === '/execute_forkbomb') {
        damage = Math.floor(Math.random() * 30) + 25;
        const integrityCost = Math.floor(Math.random() * 15) + 15;
        prometheusHP -= damage;
        playerIntegrity -= integrityCost;
        playerActionText = `> ¡BOMBA DE PROCESOS! Haces ${damage} de daño masivo, pero la inestabilidad te cuesta ${integrityCost}% de integridad.`;
    } else if (cmd === '/analyze_protocols') {
        playerActionText = `> ANALIZANDO... El núcleo de Prometeo es inestable. Una sobrecarga de procesos (/execute_forkbomb) podría ser devastadora, pero vigila tu propia integridad. Parchear tu kernel (/patch_kernel) parece restaurarla y ofrecer protección.`;
    }
    
    addMessageToLog(bossLog, playerActionText, 'system-message');
    updateHealthBars();
    if (playerIntegrity <= 0) { handleIntegrityFailure(); }
}

function handlePrometheusBossTurn() {
    triggerRandomEffect();
    const actionRoll = Math.random();
    if (actionRoll > 0.65 && !crisisActive && prometheusData.crisis_events) {
        triggerCrisis();
    } else {
        const attack = prometheusData.attacks[Math.floor(Math.random() * prometheusData.attacks.length)];
        let damageDealt = attack.damage;
        let integrityDamage = Math.floor(Math.random() * 10) + 5;
        if (playerIsDefending) {
            damageDealt = Math.floor(damageDealt / 2);
            integrityDamage = Math.floor(integrityDamage / 2);
            addMessageToLog(bossLog, '> ¡Tu kernel parcheado mitiga el daño y la corrupción!', 'system-message');
        }
        playerHP -= damageDealt;
        playerIntegrity -= integrityDamage;
        addMessageToLog(bossLog, `${attack.text} Tu integridad del sistema cae.`, 'ai-message', true);
    }
    updateHealthBars();
    if (playerHP <= 0) { triggerLoseSequence(); } 
    else if (playerIntegrity <= 0) { handleIntegrityFailure(); }
    else {
        setIsLockedCallback(false);
        bossInput.disabled = false;
        bossInput.focus();
    }
}

function handleIntegrityFailure() {
    addMessageToLog(bossLog, '> ¡INTEGRIDAD DEL SISTEMA COMPROMETIDA! Tus sistemas se colapsan por un turno.', 'system-message red-alert', true);
    playerHP -= 15;
    setIsLockedCallback(true);
    bossInput.disabled = true;
    setTimeout(() => {
        addMessageToLog(bossLog, '>...Sistemas mínimos restaurados...', 'system-message');
        playerIntegrity = 25;
        updateHealthBars();
        handlePrometheusBossTurn();
    }, 3000);
}

function handleCrisisCommand(command) {
    if (command.toLowerCase() === activeCrisis.solution_command.toLowerCase()) {
        addMessageToLog(bossLog, `> ¡ÉXITO! Has anulado el protocolo '${activeCrisis.name}'.`, 'system-message');
        crisisActive = false;
        activeCrisis = null;
        setTimeout(() => handlePrometheusBossTurn(), 2000);
    } else {
        addMessageToLog(bossLog, '> Comando incorrecto. El protocolo de emergencia sigue activo...', 'system-message', true);
        crisisTurnsLeft--;
        if (crisisTurnsLeft <= 0) {
            handleCrisisFailure(); 
        } else {
            setTimeout(() => handlePrometheusBossTurn(), 2000); 
        }
    }
}


function triggerCrisis() {
    crisisActive = true;
    activeCrisis = prometheusData.crisis_events[Math.floor(Math.random() * prometheusData.crisis_events.length)];
    crisisTurnsLeft = 2;
    const p = document.createElement('p');
    p.className = 'system-message red-alert';
    bossLog.appendChild(p);
    typewriterEffect(p, activeCrisis.alert_text);
}

function handleCrisisFailure() {
    const crisis = activeCrisis; 
    addMessageToLog(bossLog, `> ¡DEMASIADO TARDE! ${crisis.failure_text}`, 'system-message red-alert', true);

    playerHP -= crisis.failure_damage;

    crisisActive = false;
    activeCrisis = null;
    crisisTurnsLeft = 0;

    updateHealthBars();
    if (playerHP <= 0) {
        triggerLoseSequence();
    } else {
        setTimeout(() => handlePrometheusBossTurn(), 2000);
    }
}

export async function triggerWinSequence() { // Exported for Zeus's command
    setIsLockedCallback(true); 
    bossInput.disabled = true;
    body.classList.remove('critical-damage-effect');
    
    addMessageToLog(bossLog, "> FALLO CATASTRÓFICO EN EL NÚCLEO DE PROMETEO...", 'system-message');
    await new Promise(res => setTimeout(res, 2000));
    
    bossFightScreen.style.transition = 'opacity 1s ease-out';
    bossFightScreen.style.opacity = '0';
    
    await new Promise(res => setTimeout(res, 1000));
    
    bossFightScreen.classList.add('screen-hidden');
    bossFightScreen.style.opacity = '1';
    
    showPrometheusFinalDialogueCallback(); 
}

function triggerLoseSequence() {
    setIsLockedCallback(true);
    bossInput.disabled = true;
    body.classList.remove('critical-damage-effect');
    body.classList.add('red-alert');
    addMessageToLog(bossLog, '> CONEXIÓN PERDIDA... SISTEMA ERRADICADO.', 'system-message');
    setTimeout(() => {
        bossFightScreen.classList.add('screen-hidden');
        showGameOverScreenCallback('prometheus_defeat'); 
        body.classList.remove('red-alert');
    }, 3000);
}
