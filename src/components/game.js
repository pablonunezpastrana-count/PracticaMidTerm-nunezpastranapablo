import { obtenerPokemonAleatorios, mezclar } from "../api/pokeApi.js";

const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje-juego");
const reloj = document.getElementById("temporizador");
const contadorParejas = document.getElementById("parejas");
const botonReiniciar = document.getElementById("reiniciar");
const MIN_CARTAS = 10;
const MAX_CARTAS = 20;
let numeroPartida = 0;
let cartasPartida = 0;
let parejasEncontradas = 0;
let descubiertas = [];
let bloqueado = false;
let terminada = true;
let inicio = 0;
let temporizador = null;
let esperaCartas = null;

export function prepararJuego() {
  cancelarPartida();
  mensaje.textContent = "Elige el número de cartas para empezar.";
}

export function cancelarPartida() {
  numeroPartida++;
  clearInterval(temporizador);
  clearTimeout(esperaCartas);
  temporizador = null;
  esperaCartas = null;
  descubiertas = [];
  parejasEncontradas = 0;
  bloqueado = false;
  terminada = true;
  cartasPartida = 0;
  tablero.replaceChildren();
  reloj.textContent = "0m 0s";
  botonReiniciar.disabled = true;
}

export function validarNumeroCartas(valor) {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < MIN_CARTAS || numero % 2 !== 0 || numero > MAX_CARTAS) {
    return `Introduce un número entero y par, entre ${MIN_CARTAS} y ${MAX_CARTAS} cartas.`;
  }
  return "";
}

function segundosTranscurridos() {
  return Math.floor((Date.now() - inicio) / 1000);
}

async function iniciarPartida(numeroCartas) {
  cancelarPartida();
  cartasPartida = numeroCartas;
  const partidaActual = numeroPartida;
  mensaje.textContent = "Cargando los Pokémon de la partida...";
  try {
    const pokemon = await obtenerPokemonAleatorios(numeroCartas / 2);
    if (partidaActual !== numeroPartida) return;
    const cartas = mezclar([...pokemon, ...pokemon]);
    cartas.forEach((datos, indice) => crearCarta(datos, indice));
    terminada = false;
    inicio = Date.now();
    temporizador = setInterval(() => {
      reloj.textContent = formatearTiempo(segundosTranscurridos());
    }, 1000);
    contadorParejas.textContent = `0 / ${numeroCartas / 2}`;
    mensaje.textContent = "¡Partida en marcha! Encuentra todas las parejas.";
  } catch (error) {
    if (partidaActual !== numeroPartida) return;
    mensaje.textContent = `${error.message} Puedes volver a intentarlo.`;
  }
}

function crearCarta(pokemon, indice) {
  const carta = document.createElement("button");
  carta.type = "button";
  carta.className = "carta";
  carta.dataset.pokemon = pokemon.id;
  carta.setAttribute("aria-label", `Carta ${indice + 1}, oculta`);
  const reverso = document.createElement("span");
  reverso.className = "reverso pokeball";
  reverso.setAttribute("aria-hidden", "true");
  const imagen = document.createElement("img");
  imagen.src = pokemon.imagen;
  imagen.alt = pokemon.nombre;
  imagen.hidden = true;
  const nombre = document.createElement("span");
  nombre.className = "nombre-pokemon";
  nombre.textContent = pokemon.nombre;
  nombre.hidden = true;
  carta.append(reverso, imagen, nombre);
  carta.addEventListener("click", () => descubrirCarta(carta, pokemon.nombre));
  tablero.append(carta);
}

function cambiarCara(carta, visible) {
  carta.classList.toggle("descubierta", visible);
  carta.querySelector(".reverso").hidden = visible;
  carta.querySelector("img").hidden = !visible;
  carta.querySelector(".nombre-pokemon").hidden = !visible;
  carta.setAttribute("aria-label", visible
    ? carta.querySelector("img").alt : `Carta ${Array.from(tablero.children).indexOf(carta) + 1}, oculta`);
}

function descubrirCarta(carta, nombre) {
  if (terminada || bloqueado || carta.disabled || descubiertas.includes(carta)) return;
  cambiarCara(carta, true);
  descubiertas.push(carta);
  if (descubiertas.length < 2) return;

  bloqueado = true;
  const [primera, segunda] = descubiertas;
  if (primera.dataset.pokemon === segunda.dataset.pokemon) {
    for (const encontrada of descubiertas) {
      encontrada.classList.add("encontrada");
      encontrada.disabled = true;
      encontrada.setAttribute("aria-label", `${nombre}, pareja encontrada`);
    }
    parejasEncontradas++;
    contadorParejas.textContent = `${parejasEncontradas} / ${cartasPartida / 2}`;
    descubiertas = [];
    bloqueado = false;
    if (parejasEncontradas === cartasPartida / 2) finalizarPartida();
    else mensaje.textContent = "¡Pareja encontrada! Sigue buscando.";
  } else {
    mensaje.textContent = "No son iguales. Se ocultarán en un momento.";
    esperaCartas = setTimeout(() => {
      cambiarCara(primera, false);
      cambiarCara(segunda, false);
      descubiertas = [];
      bloqueado = false;
      mensaje.textContent = "Prueba con otras dos cartas.";
    }, 900);
  }
}

function finalizarPartida() {
  terminada = true;
  clearInterval(temporizador);
  const tiempo = segundosTranscurridos();
  reloj.textContent = formatearTiempo(tiempo);
  mensaje.textContent = `¡Partida terminada! Has encontrado todas las parejas en ${formatearTiempo(tiempo)}.`;
}

document.getElementById("partida-formulario").addEventListener("submit", (event) => {
  event.preventDefault();
  const valor = document.getElementById("numero-cartas").value;
  const error = validarNumeroCartas(valor);
  if (error) {
    mensaje.textContent = error;
    return;
  }
  iniciarPartida(Number(valor));
});


function formatearTiempo(segundos) {
  return `${Math.floor(segundos / 60)}m ${segundos % 60}s`;
}
