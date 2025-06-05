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
    // Buscar usuario por su email
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
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Enviar el correo
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Restablecimiento de contraseña</h2>
      <p>Hola ${user.name},</p>

      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Too-Red.</p>
      <p>Para continuar con el proceso, haz clic en el siguiente botón:</p>
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 10px;
      ">
        Restablecer contraseña
      </a>
      <p style="margin-top: 20px;"><strong>Importante:</strong> este enlace estará activo solo durante 1 hora.</p>
      <p>Si tú no solicitaste el cambio, puedes ignorar este mensaje con tranquilidad.</p>
      <p style="margin-top: 30px;">Gracias por confiar en nosotros,</p>
      <p><strong>El equipo de Too-Red</strong></p>
    </div>
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
