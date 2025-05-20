import Publication from "../../models/publicationModel.js";

const getComments = async (req, res) => {
  try {
    const { publication_id } = req.params;

    // Buscar la publicación
    const publication = await Publication.findById(publication_id)
      .populate("comments.user", "name nick image") // Popular los usuarios de los comentarios
      .exec();

    if (!publication) {
      return res.status(404).json({ status: "error", message: "Publicación no encontrada." });
    }

    // Enviar los comentarios
    return res.status(200).json({
      status: "success",
      comments: publication.comments,
    });
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    return res.status(500).json({ status: "error", message: "Error al obtener los comentarios." });
  }
};

export default getComments;
