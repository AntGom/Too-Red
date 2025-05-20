import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/emailService.js";

const register = async (req, res) => {
  try {
    const { name, surname, nick, email, password, interests } = req.body;

    if (!name || !surname || !nick || !email || !password) {
      return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { nick: nick.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Ya existe un usuario con ese correo o alias" });
    }

    //Crear usuario+cifrar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      surname,
      nick,
      email,
      password: hashedPassword,
      interests: interests || [],
    });    

    const savedUser = await newUser.save();

    //Token de confirmación
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    //Correo de confirmación
    const confirmationUrl = `${process.env.CLIENT_URL}/confirm/${token}`;
    const htmlContent = `
      <h1>¡Bienvenido, ${name}!</h1>
      <p>Por favor, confirma tu registro haciendo clic en el siguiente enlace:</p>
      <a href="${confirmationUrl}">Confirmar Registro</a>
      <p>Este enlace es válido por 1 hora.</p>
    `;

    await sendEmail(email, "Confirma tu registro en Too-Red", htmlContent);

    return res.status(200).json({
      status: "success",
      message: "Usuario registrado correctamente. Revisa tu correo y confirma tu registro en Too-Red.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ status: "error", message: "Error en el registro de usuario" });
  }
};

export default register;
