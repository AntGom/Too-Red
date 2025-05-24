import Publication from "../../../models/publicationModel.js";

const taggedPublications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = Math.max(1, parseInt(req.params.page) || 1);
    const itemsPerPage = 5;

    const options = {
      page,
      limit: itemsPerPage,
      sort: { createdAt: -1 },
      populate: [
        { path: "user", select: "_id name surname nick image" },
        { path: "tags", select: "_id name surname nick image" },
      ],
    };

    // Buscar publicaciones donde el usuario está etiquetado
    const publications = await Publication.paginate(
      { tags: userId },
      options
    );

    if (publications.totalDocs === 0) {
      return res.status(200).json({
        status: "success",
        message: "No hay publicaciones donde este usuario esté etiquetado",
        totalPages: 0,
        publications: [],
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Publicaciones obtenidas correctamente",
      totalArticles: publications.totalDocs,
      totalPages: publications.totalPages,
      currentPage: publications.page,
      hasNextPage: publications.hasNextPage,
      hasPrevPage: publications.hasPrevPage,
      publications: publications.docs,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las publicaciones etiquetadas",
      error: error.message,
    });
  }
};

export default taggedPublications;