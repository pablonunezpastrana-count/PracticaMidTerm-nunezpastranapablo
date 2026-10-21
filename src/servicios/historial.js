const HISTORIAL_KEY = "pokememory-historial";

export function obtenerHistorial() {
  const datos = JSON.parse(localStorage.getItem(HISTORIAL_KEY) || "[]");
  if (!Array.isArray(datos)) {
    throw new Error("El historial guardado no tiene un formato válido.");
  }
  return datos.filter((resultado) =>
    typeof resultado?.id === "string" && typeof resultado.nombre === "string"
    && typeof resultado.pokemon?.nombre === "string"
    && Number.isInteger(resultado.cartas) && resultado.cartas > 0 && resultado.cartas % 2 === 0
    && Number.isInteger(resultado.tiempo) && resultado.tiempo >= 0);
}

export function guardarResultado(usuario, tiempo, cartas) {
  const resultado = {
    id: crypto.randomUUID(),
    nombre: usuario.nombre,
    pokemon: { ...usuario.pokemon },
    tiempo,
    cartas,
  };
  const historial = obtenerHistorial();
  historial.push(resultado);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
  return resultado.id;
}

export function ordenarHistorial(historial) {
  return [...historial].sort((a, b) => b.cartas - a.cartas || a.tiempo - b.tiempo);
}

export function formatearTiempo(segundos) {
  return `${Math.floor(segundos / 60)}m ${segundos % 60}s`;
}
