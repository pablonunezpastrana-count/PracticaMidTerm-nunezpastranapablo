import "./styles.css";

document.getElementById("mensaje-perfil").textContent = "Estamos preparando el formulario de jugador.";

import apiConnect from "./api/pokeApi.js";

async function probarAPI() {
    try {
        const pokemon = await apiConnect("pikachu");
        console.log(pokemon);
    } catch (error) {
        console.error("Error al conectar:", error);
    }
}

probarAPI();
