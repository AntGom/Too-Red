import mongoose from "mongoose";
import Publication from "../../models/publicationModel.js";

const addComment = async (req, res) => {
  try {
    const { publication_id } = req.params;
    const { text } = req.body;

    // Validar que el ID de la publicación sea válido
    if (!mongoose.Types.ObjectId.isValid(publication_id)) {
      return res.status(400).json({ 
        status: "error", 
        message: "ID de publicación no válido." 
      });
    }

    // Validar entrada
    if (!text || text.trim() === "") {
      return res.status(400).json({ 
        status: "error", 
        message: "El comentario no puede estar vacío." 
      });
    }

    // Buscar la publicación
    const publication = await Publication.findById(publication_id);
    if (!publication) {
      return res.status(404).json({ 
        status: "error", 
        message: "Publicación no encontrada." 
      });
    }

    // Crear el comentario
    const newComment = {
      user: req.user?.id || "Usuario no autenticado",
      text,
      createdAt: new Date(),
    };

    // Añadir el comentario a la publicación
    publication.comments.push(newComment);

    // Guardar la publicación actualizada
    await publication.save();

    return res.status(200).json({
      status: "success",
      message: "Comentario añadido correctamente.",
      comment: newComment, // Devolver comentario recién añadido
    });
  } catch (error) {
    console.error("Error al añadir comentario:", error);

    // Responder con el mensaje de error
    return res.status(500).json({ 
      status: "error", 
      message: "Error al añadir el comentario.",
      error: error.message 
    });
  }
};

export default addComment;
