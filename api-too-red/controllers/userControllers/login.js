import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../services/jwt.js";

const login = async (req, res) => {
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    //Buscar usuario en BBDD
    const user = await User.findOne({ email: params.email });

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    //Usuario baneado?
    if (user.isBanned) {
      return res.status(403).send({
        status: "banned",
        message: "Tu cuenta ha sido suspendida. Contacta con soporte.",
      });
    }

    //Contraseña correcta?
    const passwordMatch = await bcrypt.compare(params.password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({
        status: "error",
        message: "La contraseña no es correcta",
      });
    }

    const token = generateToken(user);

    return res.status(200).send({
      status: "success",
      message: "Usuario identificado correctamente",
      user: {
        id: user._id,
        name: user.name,
        nick: user.nick,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el login de usuario",
      error: error.message,
    });
  }
};

export default login;
