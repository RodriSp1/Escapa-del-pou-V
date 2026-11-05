const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const txtPuntos = document.getElementById("puntos");
const txtPuntosFinales = document.getElementById("puntos-finales");

const modalInicio = document.getElementById("modal-inicio");
const modalConfig = document.getElementById("modal-config");
const modalGameOver = document.getElementById("modal-gameover");

const btnEmpezarJuego = document.getElementById("btn-empezar-juego");
const btnOpciones = document.getElementById("btn-opciones");
const btnCerrarConfig = document.getElementById("btn-cerrar-config");
const btnReintentar = document.getElementById("btn-reintentar");

// constantes de las configuraciones
const inputVelJugador = document.getElementById("vel-jugador");
const inputVelEnemigo = document.getElementById("vel-enemigo");
const inputTamJugador = document.getElementById("tam-jugador");
const inputTamDisco = document.getElementById("tam-disco");
const inputValorPuntos = document.getElementById("valor-puntos");
const selectFondoMeme = document.getElementById("fondo-meme");
const selectColorBorde = document.getElementById("color-borde");

// cargar las imagenes de los personajes y el bacardios
const imgJugador = new Image();
imgJugador.src = "pou_emo.png";

const imgEnemigo = new Image();
imgEnemigo.src = "pou_mujer.png";

const imgItem = new Image();
imgItem.src = "bacachito.jpg";

// fondos de momazos 
const fondos = {
    elmo: new Image(),
    meme67: new Image(),
    mono: new Image()
};
fondos.elmo.src = "elmo_meme.jpg";
fondos.meme67.src = "67_meme.png";
fondos.mono.src = "mono_meme.jpg";

let jugador = { x: 60, y: 180, tam: 25, vel: 5 };
let beyonce = { x: 520, y: 180, tam: 25, vel: 2 };
let disco = { x: 300, y: 200, tam: 18 };

let puntos = 0;
let puntosPorDisco = 1;
let jugando = false;
let animacionId = null;
let tipoFondo = "mono";
let movimiento = {};

window.addEventListener("keydown", (e) => movimiento[e.key] = true);
window.addEventListener("keyup", (e) => movimiento[e.key] = false);

function nuevoDisco() {
    disco.x = Math.floor(Math.random() * (canvas.width - 60)) + 30;
    disco.y = Math.floor(Math.random() * (canvas.height - 60)) + 30;
}

function actualizar() {
    if (!jugando) return;

    if (movimiento["ArrowUp"] || movimiento["w"] || movimiento["W"]) jugador.y -= jugador.vel;
    if (movimiento["ArrowDown"] || movimiento["s"] || movimiento["S"]) jugador.y += jugador.vel;
    if (movimiento["ArrowLeft"] || movimiento["a"] || movimiento["A"]) jugador.x -= jugador.vel;
    if (movimiento["ArrowRight"] || movimiento["d"] || movimiento["D"]) jugador.x += jugador.vel;

    if (jugador.x < jugador.tam) jugador.x = jugador.tam;
    if (jugador.y < jugador.tam) jugador.y = jugador.tam;
    if (jugador.x + jugador.tam > canvas.width) jugador.x = canvas.width - jugador.tam;
    if (jugador.y + jugador.tam > canvas.height) jugador.y = canvas.height - jugador.tam;

    if (beyonce.x < jugador.x) beyonce.x += beyonce.vel;
    if (beyonce.x > jugador.x) beyonce.x -= beyonce.vel;
    if (beyonce.y < jugador.y) beyonce.y += beyonce.vel;
    if (beyonce.y > jugador.y) beyonce.y -= beyonce.vel;

    let distDisco = Math.hypot(jugador.x - disco.x, jugador.y - disco.y);
    if (distDisco < jugador.tam + disco.tam) {
        puntos += puntosPorDisco;
        txtPuntos.textContent = puntos;
        nuevoDisco();
    }

    let distBeyonce = Math.hypot(jugador.x - beyonce.x, jugador.y - beyonce.y);
    if (distBeyonce < jugador.tam + beyonce.tam - 8) {
        jugando = false;
        txtPuntosFinales.textContent = puntos;
        modalGameOver.classList.remove("oculto");
    }
}

function dibujar() {
    let fondoActual = fondos[tipoFondo];
    if (fondoActual.complete && fondoActual.naturalWidth !== 0) {
        ctx.drawImage(fondoActual, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // bacachito
    if (imgItem.complete && imgItem.naturalWidth !== 0) {
        ctx.drawImage(imgItem, disco.x - disco.tam, disco.y - disco.tam, disco.tam * 2, disco.tam * 2);
    } else {
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(disco.x, disco.y, disco.tam, 0, Math.PI * 2);
        ctx.fill();
    }

    // pou emo
    if (imgJugador.complete && imgJugador.naturalWidth !== 0) {
        ctx.drawImage(imgJugador, jugador.x - jugador.tam, jugador.y - jugador.tam, jugador.tam * 2, jugador.tam * 2);
    }

    // pou asesino
    if (imgEnemigo.complete && imgEnemigo.naturalWidth !== 0) {
        ctx.drawImage(imgEnemigo, beyonce.x - beyonce.tam, beyonce.y - beyonce.tam, beyonce.tam * 2, beyonce.tam * 2);
    }
}

function loop() {
    actualizar();
    dibujar();
    if (jugando) {
        animacionId = requestAnimationFrame(loop);
    }
}

// boton pa empezar
btnEmpezarJuego.addEventListener("click", () => {
    modalInicio.classList.add("oculto");
    jugando = true;
    nuevoDisco();
    loop();
});

btnOpciones.addEventListener("click", () => {
    jugando = false;
    modalConfig.classList.remove("oculto");
});

btnCerrarConfig.addEventListener("click", () => {
    jugador.vel = parseFloat(inputVelJugador.value);
    beyonce.vel = parseFloat(inputVelEnemigo.value);
    jugador.tam = parseInt(inputTamJugador.value);
    disco.tam = parseInt(inputTamDisco.value);
    puntosPorDisco = parseInt(inputValorPuntos.value);
    tipoFondo = selectFondoMeme.value;
    canvas.style.borderColor = selectColorBorde.value;

    modalConfig.classList.add("oculto");
    jugando = true;
    loop();
});

btnReintentar.addEventListener("click", () => {
    jugador.x = 60;
    jugador.y = 180;
    beyonce.x = 520;
    beyonce.y = 180;
    puntos = 0;
    txtPuntos.textContent = 0;
    modalGameOver.classList.add("oculto");
    jugando = true;
    nuevoDisco();
    if (animacionId) cancelAnimationFrame(animacionId);
    loop();
});