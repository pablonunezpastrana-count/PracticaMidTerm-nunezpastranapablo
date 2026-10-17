import "./styles.css";
import { iniciarPerfil } from "./components/profile.js";

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
}

iniciarPerfil((usuario) => {
  entrarAlJuego(usuario);
});

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  pantallaJuego.hidden = true;
  seccionPerfil.hidden = false;
});



document.getElementById("seccion-juego").hidden = true;
document.getElementById("seccion-ranking").hidden = true;
