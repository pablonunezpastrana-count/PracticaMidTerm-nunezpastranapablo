import apiConnect, { obtenerListaPokemon } from "../api/pokeApi.js";

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
  let esperaBusqueda = null;

  async function seleccionarPokemon(nombre, numeroActual) {
    mensajeBusqueda.textContent = "Cargando Pokémon...";
    try {
      const pokemon = await apiConnect(nombre);
      if (numeroActual !== numeroBusqueda) return;
      favorito = pokemon;
      pokemonInput.value = pokemon.nombre;
      resultados.replaceChildren();
      document.getElementById("nombre-seleccionado").textContent = pokemon.nombre;
      const imagen = document.getElementById("imagen-seleccionada");
      imagen.src = pokemon.imagen;
      imagen.alt = pokemon.nombre;
      seleccion.hidden = false;
      mensajeBusqueda.textContent = "Pokémon seleccionado. Puedes buscar otro para cambiarlo.";
      mensajePerfil.textContent = "";
    } catch (error) {
      if (numeroActual !== numeroBusqueda) return;
      mensajeBusqueda.textContent = `${error.message} Inténtalo de nuevo.`;
    }
  }

  async function buscarPokemon(consulta, numeroActual) {
    mensajeBusqueda.textContent = "Buscando...";
    try {
      const lista = await obtenerListaPokemon();
      if (numeroActual !== numeroBusqueda) return;
      const coincidencias = lista.filter((pokemon) =>
        pokemon.nombre.includes(consulta) || String(pokemon.id) === consulta).slice(0, 10);
      resultados.replaceChildren();
      for (const pokemon of coincidencias) {
        const elemento = document.createElement("li");
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = `${pokemon.nombre} (#${pokemon.id})`;
        boton.addEventListener("click", () => {
          numeroBusqueda++;
          favorito = null;
          seleccion.hidden = true;
          seleccionarPokemon(pokemon.nombre, numeroBusqueda);
        });
        elemento.append(boton);
        resultados.append(elemento);
      }
      mensajeBusqueda.textContent = coincidencias.length
        ? "Selecciona uno de estos Pokémon."
        : "No hay coincidencias. Prueba con otro nombre o número.";
    } catch (error) {
      if (numeroActual !== numeroBusqueda) return;
      mensajeBusqueda.textContent = `${error.message} Revisa la conexión y vuelve a escribir.`;
    }
  }

  pokemonInput.addEventListener("input", () => {
    numeroBusqueda++;
    const numeroActual = numeroBusqueda;
    clearTimeout(esperaBusqueda);
    favorito = null;
    seleccion.hidden = true;
    resultados.replaceChildren();
    mensajePerfil.textContent = "";
    mensajeBusqueda.textContent = "";
    const consulta = pokemonInput.value.trim().toLowerCase();
    if (consulta) {
      esperaBusqueda = setTimeout(() => buscarPokemon(consulta, numeroActual), 250);
    }
  });

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const resultado = crearPerfil(nombreInput.value, favorito);
    if (!resultado.ok) {
      mensajePerfil.textContent = resultado.message;
      return;
    }
    try {
      alCrear(resultado.usuario);
      formulario.reset();
      favorito = null;
      seleccion.hidden = true;
      resultados.replaceChildren();
      mensajeBusqueda.textContent = "";
      mensajePerfil.textContent = "";
    } catch (error) {
      mensajePerfil.textContent = "No se pudo guardar el perfil. Permite el almacenamiento del navegador.";
      console.error(error);
    }
  });
}

