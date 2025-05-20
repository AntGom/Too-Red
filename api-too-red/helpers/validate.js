import validator from "validator";

const validate = (params) => {
  const errors = {};

  // Validación de nombre
  if (!params.name || validator.isEmpty(params.name) || !validator.isLength(params.name, { min: 3 })) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  } else if (!validator.isAlpha(params.name, "es-ES")) {
    errors.name = "El nombre solo puede contener letras.";
  }

  // Validación de apellidos
  if (!params.surname || validator.isEmpty(params.surname) || !validator.isLength(params.surname, { min: 3 })) {
    errors.surname = "El apellido debe tener al menos 3 caracteres.";
  } else if (!validator.isAlpha(params.surname, "es-ES")) {
    errors.surname = "El apellido solo puede contener letras.";
  }

  // Validación de alias
  if (!params.nick || validator.isEmpty(params.nick) || !validator.isLength(params.nick, { min: 3 })) {
    errors.nick = "El alias debe tener al menos 3 caracteres.";
  }

  // Validación de email
  if (!params.email || validator.isEmpty(params.email) || !validator.isEmail(params.email)) {
    errors.email = "Debes proporcionar un email válido.";
  }

  // Validación de contraseña
  if (!params.password || validator.isEmpty(params.password)) {
    errors.password = "La contraseña es obligatoria.";
  }

  // Validación de bio (opcional)
  if (params.bio && !validator.isLength(params.bio, { max: 250 })) {
    errors.bio = "La biografía no puede superar los 250 caracteres.";
  }

  return errors;
};

export default validate;
