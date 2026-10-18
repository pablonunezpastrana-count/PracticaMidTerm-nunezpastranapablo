import "./styles.css";
import { iniciarPerfil } from "./components/profile.js";
import { prepararJuego, cancelarPartida } from "./components/game.js";
import {
  guardarUsuarioEnSesion,
  obtenerUsuarioDeSesion,
  eliminarUsuarioDeSesion,
} from "./servicios/session.js";

const seccionPerfil = document.getElementById("seccion-perfil");
const pantallaJuego = document.getElementById("pantalla-juego");

function entrarAlJuego(usuario) {
  seccionPerfil.hidden = true;
  pantallaJuego.hidden = false;
  document.getElementById("nombre-jugador").textContent = usuario.nombre;
  document.getElementById("favorito-jugador").textContent = usuario.pokemon.nombre;
  const imagen = document.getElementById("imagen-jugador");
  imagen.src = usuario.pokemon.imagen;
  imagen.alt = usuario.pokemon.nombre;
  prepararJuego(usuario);
}

iniciarPerfil((usuario) => {
  guardarUsuarioEnSesion(usuario);
  entrarAlJuego(usuario);
});

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  cancelarPartida();
  eliminarUsuarioDeSesion();
  pantallaJuego.hidden = true;
  seccionPerfil.hidden = false;
});

const usuarioSesion = obtenerUsuarioDeSesion();
if (usuarioSesion) {
  entrarAlJuego(usuarioSesion);
}


document.getElementById("seccion-ranking").hidden = true;
