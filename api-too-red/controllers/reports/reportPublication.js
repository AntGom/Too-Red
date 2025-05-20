import Publication from "../../models/publicationModel.js";
import User from "../../models/userModel.js";
import { sendEmail } from "../../services/emailService.js";

const reportPublication = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  try {
    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    //Ya se ha reportado antes?
    const alreadyReported = publication.reports.some(
      (report) => report.user.toString() === userId
    );

    if (alreadyReported) {
      return res.status(400).json({
        status: "error",
        message: "Ya has reportado esta publicación",
      });
    }

    //Nickname denunciante
    const reportUser = await User.findById(userId);
    const reportUserNickname = reportUser ? reportUser.nick : "Usuario desconocido";

    //Nickname denunciado
    const postUser = await User.findById(publication.user);
    const postUserNickname = postUser ? postUser.nick : "Usuario desconocido";

    //Fecha de denuncia
    const reportDate = new Date();
    const formattedDate = reportDate.toLocaleString();

    //Añadir reporte
    publication.reports.push({ user: userId, reason });
    publication.reportCount = publication.reports.length;

    await publication.save();

    //Correo al admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = "Reporte de Publicación en Too-Red";
    const htmlContent = `
      <h1>Nuevo Reporte de Publicación</h1>
      <p>Una publicación de <strong>${postUserNickname}</strong> ha sido denunciada por el usuario <strong>${reportUserNickname}</strong>.</p>
      <p><strong>Motivo del reporte:</strong> ${reason}</p>
      <p><strong>Fecha de la denuncia:</strong> ${formattedDate}</p>
      <p><strong>ID de la publicación:</strong> ${publication._id}</p>
    `;
    await sendEmail(adminEmail, subject, htmlContent);

    return res.status(200).json({
      status: "success",
      message: "Reporte enviado con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al reportar la publicación",
      error: error.message,
    });
  }
};

export default reportPublication;
