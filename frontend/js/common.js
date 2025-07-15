// js/common.js

/**
 * Efecto de máquina de escribir para un elemento HTML.
 * @param {HTMLElement} element - El elemento donde se escribirá el texto.
 * @param {string} text - El texto a escribir.
 * @param {function} [callback] - Función a ejecutar cuando termine.
 */
export function typewriterEffect(element, text, callback = () => {}) {
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

/**
 * Añade un mensaje al log principal del chat.
 * @param {HTMLElement} chatLogEl - El elemento del log del chat.
 * @param {string} message - El mensaje a añadir.
 * @param {string} className - La clase CSS para el mensaje.
 * @param {boolean} [useTypewriter=false] - Si se debe usar el efecto de máquina de escribir.
 */
export function addMessageToLog(chatLogEl, message, className, useTypewriter = false) {
    const p = document.createElement('p');
    p.className = className;
    chatLogEl.appendChild(p);
    if (useTypewriter) {
        typewriterEffect(p, message.replace(/\n/g, '<br>'));
    } else {
        p.innerHTML = message.replace(/\n/g, '<br>');
    }
    chatLogEl.scrollTop = chatLogEl.scrollHeight;
}
