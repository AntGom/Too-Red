import Publication from "../../models/publicationModel.js";
import User from "../../models/userModel.js";
import { sendEmail } from "../../services/emailService.js";

const revertReport = async (req, res) => {
  const { publicationId, reportId } = req.params;
  const userId = req.user.id;

  try {
    //Rol
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para revertir este reporte",
      });
    }

    //Publicación con población usuarios en reportes
    const publication = await Publication.findById(publicationId).populate("reports.user");

    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    // Buscar reporte
    const report = publication.reports.find(
      (report) => report._id.toString() === reportId
    );

    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Reporte no encontrado",
      });
    }

    //Cambio estado reporte
    if (report.status === "reverted") {
      return res.status(400).json({
        status: "error",
        message: "El reporte ya ha sido revertido",
      });
    }

    report.status = "reverted";

    await publication.save();

    //Email usuario que reportó
    const reportingUser = report.user;
    if (reportingUser && reportingUser.email) {
      const emailSubject = "Reporte revisado - Too-Red";
      const emailContent = `
        <h1>Reporte Revisado</h1>
        <p>Hola ${reportingUser.nick || "usuario"},</p>
        <p>El reporte que realizaste sobre una publicación ha sido revisado. Tras una evaluación, no se han encontrado motivos para bloquear la publicación.</p>
        <p>Si tienes dudas, por favor contáctanos.</p>
        <p>Gracias,</p>
        <p>El equipo de Too-Red</p>
      `;

      await sendEmail(reportingUser.email, emailSubject, emailContent);
    } else {
      return res.status(400).json({
        status: "error",
        message: "No se pudo encontrar el correo del usuario que reportó.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Reporte revertido con éxito y correo enviado al usuario que reportó.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al revertir el reporte",
      error: error.message,
    });
  }
};

export default revertReport;
