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
      <h1>Tu cuenta ha sido baneada</h1>
      <p>Hola ${user.name},</p>
      <p>Tu cuenta en Too-Red ha sido baneada por un administrador debido a un incumplimiento de nuestras políticas.</p>
      <p>Si crees que esto es un error, por favor contacta con soporte.</p>
    `;
    await sendEmail(user.email, subject, html);

    return res.status(200).send({ status: "success", message: MESSAGES.USER.BANNED_SUCCESS });
  } catch (error) {
    return res.status(500).send({ status: "error", message: MESSAGES.GENERAL.SERVER_ERROR });
  }
};

export default banUser;
