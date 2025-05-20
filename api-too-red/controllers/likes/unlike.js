import Publication from "../../models/publicationModel.js";

const unlike = async (req, res) => {
  try {
    const publicationId = req.params.publication_id;
    const userId = req.user.id;

    const publication = await Publication.findById(publicationId);

    if (!publication) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Verificar si el usuario ha dado like
    if (!publication.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "No has dado like a esta publicación" });
    }

    publication.likes = publication.likes.filter(
      (likeUserId) => likeUserId.toString() !== userId
    );

    await publication.save();

    res.status(200).json({
      message: "Like eliminado con éxito",
      likesCount: publication.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se ha podido eliminar el Like",
      error: error.message,
    });
  }
};

export default unlike;
