const MESSAGES = {
    AUTH: {
      MISSING_TOKEN: "La petición no tiene la cabecera de autenticación",
      INVALID_TOKEN: "Token inválido",
      BANNED: "Tu cuenta está baneada",
      UNAUTHORIZED: "No tienes permisos para realizar esta acción",
    },
    USER: {
      NOT_FOUND: "Usuario no encontrado",
      ALREADY_BANNED: "El usuario ya está baneado",
      ALREADY_UNBANNED: "El usuario ya está activo",
      BANNED_SUCCESS: "Usuario baneado correctamente",
      UNBANNED_SUCCESS: "Usuario desbaneado correctamente",
    },
    GENERAL: {
      SERVER_ERROR: "Ha ocurrido un error en el servidor",
    },
  };
  
  export default MESSAGES;