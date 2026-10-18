const SESSION_KEY = "usuario";

export function guardarUsuarioEnSesion(usuario) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

export function obtenerUsuarioDeSesion() {
  try {
    const usuario = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (usuario && typeof usuario.nombre === "string"
      && usuario.nombre.trim().length >= 3 && usuario.nombre.length <= 15
      && Number.isInteger(usuario.pokemon?.id) && usuario.pokemon.id > 0
      && typeof usuario.pokemon.nombre === "string" && usuario.pokemon.nombre
      && typeof usuario.pokemon.imagen === "string" && usuario.pokemon.imagen) {
      return usuario;
    }
  } catch (error) {
    console.error("No se pudo recuperar la sesión:", error);
  }
  return null;
}

export function eliminarUsuarioDeSesion() {
  sessionStorage.removeItem(SESSION_KEY);
}