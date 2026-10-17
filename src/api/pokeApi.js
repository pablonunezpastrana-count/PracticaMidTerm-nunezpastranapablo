const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let listaPokemon = null;
const pokemonGuardados = {};

async function pedirDatos(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("No se han podido obtener los datos de PokeAPI.");
  }
  return respuesta.json();
}

export async function obtenerListaPokemon() {
  if (!listaPokemon) {
    listaPokemon = cargarLista();
  }
  try {
    return await listaPokemon;
  } catch (error) {
    listaPokemon = null;
    throw error;
  }
}

async function cargarLista() {
  const primeraPagina = await pedirDatos(`${BASE_URL}?limit=1`);
  const datos = await pedirDatos(`${BASE_URL}?limit=${primeraPagina.count}`);
  return datos.results.map((pokemon) => ({
    nombre: pokemon.name,
    id: Number(pokemon.url.split("/").filter(Boolean).pop()),
  }));
}

export default async function apiConnect(nombre) {
  const consulta = String(nombre).trim().toLowerCase();
  if (pokemonGuardados[consulta]) {
    return pokemonGuardados[consulta];
  }
  const datos = await pedirDatos(`${BASE_URL}/${encodeURIComponent(consulta)}`);
  let imagen = datos.sprites.front_default
    || datos.sprites.other?.["official-artwork"]?.front_default
    || datos.sprites.other?.home?.front_default;

  if (!imagen) {
    const especie = await pedirDatos(datos.species.url);
    const formaNormal = especie.varieties.find((forma) => forma.is_default);
    const forma = await pedirDatos(formaNormal.pokemon.url);
    imagen = forma.sprites.front_default || forma.sprites.other?.["official-artwork"]?.front_default;
  }
  if (!imagen) {
    throw new Error("Este Pokémon no tiene una imagen disponible.");
  }
  const pokemon = { id: datos.id, nombre: datos.name, imagen };
  pokemonGuardados[consulta] = pokemon;
  return pokemon;
}

export function mezclar(elementos) {
  const copia = [...elementos];
  for (let i = copia.length - 1; i > 0; i--) {
    const posicion = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[posicion]] = [copia[posicion], copia[i]];
  }
  return copia;
}

export async function obtenerPokemonAleatorios(numeroParejas) {
  const lista = await obtenerListaPokemon();
  const disponibles = lista.filter((pokemon) => pokemon.id < 10000);
  if (numeroParejas > disponibles.length) {
    throw new Error(`Puedes jugar con un máximo de ${disponibles.length * 2} cartas.`);
  }
  const elegidos = mezclar(disponibles).slice(0, numeroParejas);
  return Promise.all(elegidos.map((pokemon) => apiConnect(pokemon.nombre)));
}

