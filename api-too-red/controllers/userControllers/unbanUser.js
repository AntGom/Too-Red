import User from "../../models/userModel.js";
import MESSAGES from "../../services/messages.js";
import { sendEmail } from "../../services/emailService.js";

const unbanUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send({ status: "error", message: MESSAGES.AUTH.UNAUTHORIZED });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: MESSAGES.USER.NOT_FOUND });
    }

    if (!user.isBanned) {
      return res
        .status(400)
        .send({ status: "error", message: MESSAGES.USER.ALREADY_UNBANNED });
    }

    user.isBanned = false;
    await user.save();

    //Enviar correo al usuario
    const subject = "Notificación de reactivación de cuenta - Too-Red";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Tu cuenta ha sido reactivada</h2>
      <p>Hola ${user.name},</p>
      <p>Te informamos que tu cuenta en <strong>Too-Red</strong> ha sido reactivada. Ya puedes volver a iniciar sesión y disfrutar de nuestros servicios con normalidad.</p>
      <p>Gracias por tu paciencia y comprensión.</p>
      <p style="margin-top: 30px;"><strong>El equipo de Too-Red</strong><p/>
    </div>
    `;
    await sendEmail(user.email, subject, html);

    return res
      .status(200)
      .send({ status: "success", message: MESSAGES.USER.UNBANNED_SUCCESS });
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: MESSAGES.GENERAL.SERVER_ERROR });
  }
};

export default unbanUser;
