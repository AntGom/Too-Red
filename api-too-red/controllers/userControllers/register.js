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
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>¡Bienvenido a Too-Red!</h2>
      <p>Hola ${name},</p>
      <p>Gracias por registrarte. Para completar el proceso y activar tu cuenta, haz clic en el siguiente botón:</p>
      <a href="${confirmationUrl}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 10px;
      ">
        Confirmar registro
      </a>
      <p style="margin-top: 20px;"><strong>Nota:</strong> este enlace es válido por 1 hora.</p>
      <p>Si tú no realizaste el registro, puedes ignorar este mensaje.</p>
      <p style="margin-top: 30px;">¡Nos alegra tenerte con nosotros!</p>
      <p><strong>El equipo de Too-Red</strong></p>
    </div>

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
