import Publication from "../../../models/publicationModel.js";
import User from "../../../models/userModel.js";
import Follow from "../../../models/followModel.js";

const addTag = async (req, res) => {
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

    // Verificar si usuario es owner
    if (publication.user.toString() !== currentUserId) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para etiquetar usuarios en esta publicación",
      });
    }

    // Verificar si usuario a etiquetar existe
    const userToTag = await User.findById(taggedUserId);
    if (!userToTag) {
      return res.status(404).json({
        status: "error",
        message: "Usuario a etiquetar no encontrado",
      });
    }

    // Verificar si usuario ya etiquetado
    if (publication.tags.includes(taggedUserId)) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya está etiquetado en esta publicación",
      });
    }

    // Verificar si el usuario es el propio autor
    if (taggedUserId !== currentUserId) {
      // Si no es el propio autor, verificar si sigue al usuario
      const followExists = await Follow.findOne({
        user: currentUserId,
        followed: taggedUserId,
      });

      if (!followExists) {
        return res.status(403).json({
          status: "error",
          message: "Solo puedes etiquetar a usuarios que sigues",
        });
      }
    }

    // Añadir etiqueta
    publication.tags.push(taggedUserId);
    await publication.save();

    // Populate para devolver información completa
    const updatedPublication = await Publication.findById(publicationId)
      .populate("user", "name surname nick image")
      .populate("tags", "name surname nick image");

    return res.status(200).json({
      status: "success",
      message: "Usuario etiquetado correctamente",
      publication: updatedPublication,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al etiquetar al usuario",
      error: error.message,
    });
  }
};

export default addTag;