import Publication from "../../models/publicationModel.js";

const getUserLikes = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const page = parseInt(req.params.page) || 1;
    const limit = 10;

    //Publicaciones con ID del user en array likes
    const options = {
      page,
      limit,
      populate: {
        path: "user",
        select: "nick", //Owner de publicación
      },
      sort: { createdAt: -1 },
    };

    const publications = await Publication.paginate({ likes: userId }, options);

    if (!publications.docs.length) {
      return res.status(404).json({
        message: "Este usuario no ha dado likes a ninguna publicación.",
      });
    }

    res.status(200).json({
      totalLikes: publications.totalDocs,
      totalPages: publications.totalPages,
      currentPage: publications.page,
      publications: publications.docs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se ha podido obtener los likes del usuario",
      error: error.message,
    });
  }
};

export default getUserLikes;
