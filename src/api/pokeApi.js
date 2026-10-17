const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export default async function apiConnect(nombre) {
  const consulta = String(nombre).trim().toLowerCase();
  const respuesta = await fetch(`${BASE_URL}/${encodeURIComponent(consulta)}`);
  if (!respuesta.ok) {
    throw new Error("No se ha encontrado ese Pokémon. Revisa el nombre o número.");
  }
  const datos = await respuesta.json();
  const imagen = datos.sprites.front_default || datos.sprites.other?.["official-artwork"]?.front_default;
  if (!imagen) throw new Error("Este Pokémon no tiene una imagen disponible.");
  return { id: datos.id, nombre: datos.name, imagen };
}
