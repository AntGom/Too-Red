import Publication from "../../../models/publicationModel.js";

const removeTag = async (req, res) => {
  try {
    const { id: publicationId, userId: taggedUserId } = req.params;
    const currentUserId = req.user.id;

    // Verificar si la publicación existe
    const publication = await Publication.findById(publicationId);
    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    // Verificar si el usuario actual es el creador de la publicación o el usuario etiquetado
    // (un usuario puede quitarse a sí mismo de una etiqueta)
    if (
      publication.user.toString() !== currentUserId &&
      taggedUserId !== currentUserId
    ) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para quitar esta etiqueta",
      });
    }

    // Verificar si el usuario está etiquetado
    if (!publication.tags.some(tag => tag.toString() === taggedUserId)) {
      return res.status(400).json({
        status: "error",
        message: "El usuario no está etiquetado en esta publicación",
      });
    }

    // Quitar la etiqueta
    publication.tags = publication.tags.filter(
      tag => tag.toString() !== taggedUserId
    );
    await publication.save();

    return res.status(200).json({
      status: "success",
      message: "Etiqueta eliminada correctamente",
      publication,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la etiqueta",
      error: error.message,
    });
  }
};

export default removeTag;