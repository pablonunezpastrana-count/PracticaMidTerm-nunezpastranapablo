import apiConnect from "../api/pokeApi.js";

export function crearPerfil(username, pokemon) {
  const nombre = username.trim();
  if (nombre.length < 3 || nombre.length > 15) {
    return { ok: false, message: "El nombre de usuario debe tener entre 3 y 15 caracteres." };
  }
  if (!pokemon) {
    return { ok: false, message: "Selecciona un Pokémon de las coincidencias antes de continuar." };
  }
  return { ok: true, usuario: { nombre, pokemon } };
}

export function iniciarPerfil(alCrear) {
  const formulario = document.getElementById("perfil-formulario");
  const nombreInput = document.getElementById("nombre-usuario");
  const pokemonInput = document.getElementById("pokemon");
  const resultados = document.getElementById("resultados-pokemon");
  const mensajeBusqueda = document.getElementById("mensaje-busqueda");
  const mensajePerfil = document.getElementById("mensaje-perfil");
  const seleccion = document.getElementById("pokemon-seleccionado");
  let favorito = null;
  let numeroBusqueda = 0;

  pokemonInput.addEventListener("change", async () => {
    const busquedaActual = ++numeroBusqueda;
    favorito = null;
    seleccion.hidden = true;
    resultados.replaceChildren();
    const consulta = pokemonInput.value.trim();
    if (!consulta) {
      mensajeBusqueda.textContent = "";
      return;
    }
    mensajeBusqueda.textContent = "Buscando Pokémon por nombre completo o número...";
    try {
      const pokemon = await apiConnect(consulta);
      if (busquedaActual !== numeroBusqueda) return;
      const elemento = document.createElement("li");
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = pokemon.nombre;
      boton.addEventListener("click", () => {
        favorito = pokemon;
        document.getElementById("nombre-seleccionado").textContent = pokemon.nombre;
        const imagen = document.getElementById("imagen-seleccionada");
        imagen.src = pokemon.imagen;
        imagen.alt = pokemon.nombre;
        seleccion.hidden = false;
        mensajeBusqueda.textContent = "Pokémon seleccionado.";
        resultados.replaceChildren();
      });
      elemento.append(boton);
      resultados.append(elemento);
      mensajeBusqueda.textContent = "Pulsa el resultado para seleccionarlo.";
    } catch (error) {
      if (busquedaActual !== numeroBusqueda) return;
      mensajeBusqueda.textContent = error.message;
    }
  });

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const resultado = crearPerfil(nombreInput.value, favorito);
    if (!resultado.ok) {
      mensajePerfil.textContent = resultado.message;
      return;
    }
    alCrear(resultado.usuario);
    formulario.reset();
    favorito = null;
    seleccion.hidden = true;
    resultados.replaceChildren();
    mensajeBusqueda.textContent = "";
    mensajePerfil.textContent = "";
  });
}
