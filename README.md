**Nombre y apellidos del alumno:** Pablo Núñez Pastrana.

**Enlace al video:** https://youtu.be/qVlcvNoVZo0

**Repositorio:** PracticaMidTerm-nunezpastranapablo

**URL aplicación desplegada:** https://pablonunezpastrana-count.github.io/PracticaMidTerm-nunezpastranapablo/


# PracticaMidTerm-nunezpastranapablo
# PokeMemory

Práctica de Memory con Pokémon. Está hecha con HTML, CSS y JavaScript, usando Vite. No utiliza frameworks ni librerías de componentes. Los datos y las imágenes se consultan con `fetch` en [PokeAPI](https://pokeapi.co/docs/v2).

## Ejecutar el proyecto

Desde esta carpeta:

```sh
npm install
npm run dev
```

Abre la dirección que muestre Vite. Necesitas conexión a Internet para buscar y cargar Pokémon.

```sh
npm run lint
npm run build
npm run preview
```

`lint` revisa JavaScript con ESLint y el HTML con HTMLHint. `build` crea la carpeta `dist` para publicar la aplicación. `preview` permite comprobar esa versión. Estas herramientas son dependencias de desarrollo; la aplicación usa JavaScript nativo.

## Cómo se juega

1. Escribe un nombre de entre 3 y 15 caracteres.
2. Busca un Pokémon por nombre o identificador. Se muestran como máximo diez coincidencias. Pulsa una para seleccionarla; puedes buscar otra antes de crear el perfil.
3. Crea el perfil y elige un número entero y par de cartas, entre 10 y 20. El valor inicial es 12.
4. Descubre dos cartas e intenta encontrar todas las parejas. Una pareja correcta queda en verde; una incorrecta se oculta después de 900 ms.
5. Puedes reiniciar cuando quieras. El temporizador comienza cuando se carga el tablero.
6. Al completar la partida se guarda el resultado y se actualiza el ranking.

El mínimo es de 10 cartas y el máximo es de 20. El campo numérico indica ambos límites y JavaScript rechaza cantidades fuera del rango, números impares y decimales. No se repite la misma pareja en el tablero. Las formas alternativas también se pueden elegir como favorito.

## Organización

- `src/main.js`: entrada de la aplicación y cambio entre perfil y juego.
- `src/api/pokeApi.js`: peticiones con `fetch`, catálogo, caché y selección aleatoria.
- `src/components/profile.js`: buscador, selección y validación del perfil.
- `src/components/game.js`: cartas, parejas, bloqueo de clics, reinicio y temporizador.
- `src/components/ranking.js`: tabla de resultados, posiciones y última partida destacada.
- `src/servicios/session.js`: perfil en `sessionStorage`, con la clave `usuario`.
- `src/servicios/historial.js`: resultados en `localStorage`, con la clave `pokememory-historial`.
- `src/styles.css`: estilos y adaptación a pantallas pequeñas.

La sesión permanece al recargar la pestaña. Cerrar sesión elimina el perfil, pero conserva el historial. Una partida a medias no se guarda: solo se registran partidas terminadas. El ranking se ordena por más cartas y después por menos segundos. Muestra las cinco primeras posiciones y la última partida aunque esté más abajo; el botón permite ver todos los resultados.