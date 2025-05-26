import User from "../../models/userModel.js";
import MESSAGES from "../../services/messages.js";
import { sendEmail } from "../../services/emailService.js";

const banUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ status: "error", message: MESSAGES.AUTH.UNAUTHORIZED });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ status: "error", message: MESSAGES.USER.NOT_FOUND });
    }

    if (user.isBanned) {
      return res.status(400).send({ status: "error", message: MESSAGES.USER.ALREADY_BANNED });
    }

    user.isBanned = true;
    await user.save();

    //Enviar correo al usuario
    const subject = "Notificación de cuenta baneada - Too-Red";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Tu cuenta ha sido suspendida</h2>
      <p>Hola ${user.name},</p>
      <p>Te informamos que tu cuenta en <strong>Too-Red</strong> ha sido suspendida temporalmente por un administrador debido a una posible infracción de nuestras políticas de uso.</p>
      <p>Si consideras que se trata de un error o deseas apelar esta decisión, por favor contacta con nuestro equipo de soporte:</p>
      <a href="mailto:soporte@too-red.com" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 10px 0;
      ">
        Contactar con soporte
      </a>
      <p style="margin-top: 20px;">Gracias por tu comprensión.</p>
      <p><strong>El equipo de Too-Red</strong></p>
    </div>

    `;
    await sendEmail(user.email, subject, html);

    return res.status(200).send({ status: "success", message: MESSAGES.USER.BANNED_SUCCESS });
  } catch (error) {
    return res.status(500).send({ status: "error", message: MESSAGES.GENERAL.SERVER_ERROR });
  }
};

export default banUser;
