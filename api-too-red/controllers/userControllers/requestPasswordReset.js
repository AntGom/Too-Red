import User from "../../models/userModel.js";
import crypto from "crypto";
import { sendEmail } from "../../services/emailService.js";

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      status: "error",
      message: "El email es obligatorio",
    });
  }

  try {
    // Buscar el usuario por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró un usuario con ese email",
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar el correo
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailHtml = `
      <h1>Recuperación de contraseña</h1>
      <p>Hola ${user.name},</p>
      <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Si no solicitaste esta recuperación, ignora este mensaje.</p>
    `;

    await sendEmail(user.email, "Recuperación de contraseña", emailHtml);

    return res.status(200).send({
      status: "success",
      message: "Correo de recuperación enviado",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al enviar el correo",
      error: error.message,
    });
  }
};

export default requestPasswordReset;
