import Publication from "../../models/publicationModel.js";

const getLikes = async (req, res) => {
    try {
      const publicationId = req.params.publication_id;
      const publication = await Publication.findById(publicationId).populate({
        path: "likes",
        select: "nick",
      });
  
      if (!publication) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }
  
      res.status(200).json({
        likesCount: publication.likes.length,
        likes: publication.likes,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener los likes" });
    }
  };

  export default getLikes;
  