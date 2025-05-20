import Publication from "../../models/publicationModel.js";
import { sendEmail } from "../../services/emailService.js"; // Asegúrate de importar tu servicio de correo.

const remove = async (req, res) => {
  try {
    //Busca publicación
    const publication = await Publication.findById(req.params.id).populate("user");
    console.log("Publicación encontrada:", publication);

    //Publicación existe?
    if (!publication) {
      console.log("La publicación no existe.");
      return res.status(404).json({
        status: "error",
        message: "La publicación no existe",
      });
    }

    //Usuario owner/admin
    const isOwner = publication.user?._id.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (isOwner || isAdmin) {
      //Correo si admin borra
      if (isAdmin) {
        const emailSubject = "Publicación eliminada - Too-Red";
        const emailContent = `
          <h1>Publicación Eliminada</h1>
          <p>Hola ${publication.user.nick || "usuario"},</p>
          <p>Tu publicación ha sido eliminada por incumplir las normas de nuestra comunidad.</p>
          <p>Si crees que esto es un error, por favor contáctanos.</p>
          <p>Gracias,</p>
          <p>El equipo de Too-Red</p>
        `;
        const recipientEmail = publication.user.email;

        console.log("Correo del propietario de la publicación:", recipientEmail);
        try {
          await sendEmail(recipientEmail, emailSubject, emailContent);
          console.log("Correo enviado.");
        } catch (emailError) {
          console.error("Error al enviar el correo:", emailError.message);
        }
      }

      //Eliminar publicación
      await publication.deleteOne();

      return res.status(200).json({
        status: "success",
        message: "Publicación eliminada correctamente",
        publication: req.params.id,
      });
    } else {
      console.log("El usuario no tiene permiso para eliminar esta publicación.");
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar esta publicación",
      });
    }
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la publicación",
      error: error.message,
    });
  }
};

export default remove;
