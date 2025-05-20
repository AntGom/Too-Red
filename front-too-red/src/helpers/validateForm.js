import validator from "validator";

// Validación en el frontend
const validateForm = (params) => {
  const errors = {};

  // Validación de nombre
  if (
    !params.name ||
    validator.isEmpty(params.name) ||
    !validator.isLength(params.name, { min: 3 })
  ) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  } else if (!validator.isAlpha(params.name, "es-ES", { ignore: " " })) {
    errors.name = "El nombre solo puede contener letras.";
  }

  // Validación de apellidos
  if (
    !params.surname ||
    validator.isEmpty(params.surname) ||
    !validator.isLength(params.surname, { min: 3 })
  ) {
    errors.surname = "El apellido debe tener al menos 3 caracteres.";
  } else if (!validator.isAlpha(params.surname, "es-ES", { ignore: " " })) {
    errors.surname = "El apellido solo puede contener letras.";
  }

  // Validación de alias
  if (
    !params.nick ||
    validator.isEmpty(params.nick) ||
    !validator.isLength(params.nick, { min: 3 })
  ) {
    errors.nick = "El alias debe tener al menos 3 caracteres.";
  }

  // Validación de email
  if (
    !params.email ||
    validator.isEmpty(params.email) ||
    !validator.isEmail(params.email)
  ) {
    errors.email = "El email no es válido.";
  }

  // Validación de contraseña
  if (
    !params.password ||
    validator.isEmpty(params.password) ||
    !validator.isLength(params.password, { min: 6 })
  ) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errors;
};

export default validateForm;
