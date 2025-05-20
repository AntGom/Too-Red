import Publication from "../../models/publicationModel.js";

const detail = async (req, res) => {
  
  try {

    // Id de la publicación
    const publication = await Publication.findById(req.params.id).populate('user', 'image');

    if (!publication) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Publicación obtenida correctamente",
      publication: publication,
      userId: publication.user._id,
      userImage: publication.user.image, 
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la publicación",
      error: error.message,
    });
  }
};

export default detail;
