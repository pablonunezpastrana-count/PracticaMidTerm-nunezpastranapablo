import { obtenerHistorial, ordenarHistorial, formatearTiempo } from "../servicios/historial.js";

let ultimoResultado = null;
let mostrarTodos = false;
const botonVer = document.getElementById("ver-ranking");

botonVer.addEventListener("click", () => {
  mostrarTodos = !mostrarTodos;
  mostrarRanking();
});

export function mostrarRanking(idResultado) {
  if (idResultado) ultimoResultado = idResultado;
  const cuerpo = document.getElementById("ranking-cuerpo");
  const mensaje = document.getElementById("mensaje-ranking");
  cuerpo.replaceChildren();
  botonVer.hidden = true;
  try {
    const ranking = ordenarHistorial(obtenerHistorial());
    if (!ranking.length) {
      mensaje.textContent = "Todavía no hay resultados. Completa una partida para aparecer aquí.";
      return;
    }
    let omitidos = 0;
    ranking.forEach((resultado, indice) => {
      const esUltimo = resultado.id === ultimoResultado;
      if (!mostrarTodos && indice >= 5 && !esUltimo) {
        omitidos++;
        return;
      }
      const fila = document.createElement("tr");
      if (esUltimo) fila.classList.add("ultimo-resultado");
      const valores = [indice + 1, resultado.nombre, resultado.pokemon.nombre,
      formatearTiempo(resultado.tiempo), resultado.cartas];
      valores.forEach((valor, posicion) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        if (posicion === 1 && esUltimo) celda.append(" · Última partida");
        if (posicion === 2) celda.classList.add("nombre-pokemon");
        fila.append(celda);
      });
      cuerpo.append(fila);
    });
    mensaje.textContent = omitidos > 0
      ? `${ranking.length} partidas registradas. Hay ${omitidos} resultados ocultos.`
      : `${ranking.length} partidas registradas.`;
    botonVer.hidden = ranking.length <= 5;
    botonVer.textContent = mostrarTodos ? "Ver menos resultados" : "Ver todos los resultados";
  } catch (error) {
    mensaje.textContent = "No se pudo leer el historial guardado en el navegador.";
    console.error(error);
  }
}
