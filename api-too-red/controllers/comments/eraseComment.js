import Publication from "../../models/publicationModel.js";

const deleteComment = async (req, res) => {
  try {
    const { publication_id, comment_id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Verificar que tenemos el ID del usuario
    if (!req.user || !req.user.id) {
      console.error("Error: Usuario no autenticado o ID no disponible");
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado.",
      });
    }

    // Validar los IDs recibidos
    if (!publication_id || !comment_id) {
      console.error("Error: IDs de publicación o comentario no proporcionados");
      return res.status(400).json({
        status: "error",
        message: "IDs de publicación o comentario no proporcionados.",
      });
    }

    // Buscar la publicación
    const publication = await Publication.findById(publication_id);

    if (!publication) {
      console.error(
        `Error: Publicación no encontrada con ID: ${publication_id}`
      );
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada.",
      });
    }

    // Buscar el comentario
    const comment = publication.comments.id(comment_id);

    if (!comment) {
      console.error(`Error: Comentario no encontrado con ID: ${comment_id}`);
      return res.status(404).json({
        status: "error",
        message: "Comentario no encontrado.",
      });
    }

    // Comprobar propiedad del comentario/publicacion o Admin
    if (
      comment.user.toString() !== userId &&
      publication.user.toString() !== userId &&
      userRole !== "admin" &&
      userRole !== "master"
    ) {
      console.error(
        `Error: Usuario ${userId} no autorizado para eliminar el comentario ${comment_id}`
      );
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar este comentario.",
      });
    }

    // Eliminar el comentario usando el método pull de MongoDB
    publication.comments.pull(comment_id);
    await publication.save();

    return res.status(200).json({
      status: "success",
      message: "Comentario eliminado con éxito.",
    });
  } catch (error) {
    console.error("Error detallado al eliminar el comentario:", {
      message: error.message,
      stack: error.stack,
      userId: req?.user?.id,
      publicationId: req?.params?.publication_id,
      commentId: req?.params?.comment_id,
    });

    return res.status(500).json({
      status: "error",
      message: "Error al eliminar el comentario.",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default deleteComment;
