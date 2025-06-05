import Publication from "../../models/publicationModel.js";
import { followUserIds } from "../../services/followService.js";
import User from "../../models/userModel.js";

const feed = async (req, res) => {
  try {
    let identity = req.user;
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 5;

    // Usuario = admin?
    const isAdmin = identity.role === "admin";

    // Usuario = admin => mostrar todas publicaciones
    if (isAdmin) {
      const publications = await Publication.paginate({}, {
        page: page,
        limit: itemsPerPage,
        populate: [
          { path: "user", select: "_id name surname nick image" },
          { path: "comments.user", select: "_id name nick image" },
          { path: "likes.user", select: "_id name nick" },
          { path: "tags", select: "_id name surname nick image" },
        ],
        sort: { createdAt: -1 },
      });

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
    }

    // Si != admin, ver seguidos, intereses comunes y mi mismo
    const user = await User.findById(identity.id).select("interests");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    // Usuarios seguidos
    let followUserId = await followUserIds(identity.id);

    // Usuarios con intereses comunes (excluyéndome mí)
    const usersWithCommonInterests = await User.find({
      interests: { $in: user.interests },
      _id: { $ne: identity.id },
    }).select("_id");

    const commonInterestUserIds = usersWithCommonInterests.map(u => u._id);

    // IDs de administradores
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const adminIds = adminUsers.map(admin => admin._id);

    // Combinar IDs: seguidos, intereses comunes, yo mismo y admins
    const userIds = [...new Set([
      ...followUserId.following,
      ...commonInterestUserIds,
      ...adminIds,
      identity.id,
    ])];

    if (userIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: `No sigues a nadie ni hay usuarios con intereses comunes, ${identity.name}.`,
        totalArticles: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
        publications: [],
      });
    }

    const query = { user: { $in: userIds } };

    const publications = await Publication.paginate(query, {
      page: page,
      limit: itemsPerPage,
      populate: [
        { path: "user", select: "_id name surname nick image" },
        { path: "comments.user", select: "_id name nick image" },
        { path: "likes.user", select: "_id name nick" },
        { path: "tags", select: "_id name surname nick image" },
      ],
      sort: { createdAt: -1 },
    });

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
      message: "Error al obtener el feed",
      error: error.message,
    });
  }
};

export default feed;
