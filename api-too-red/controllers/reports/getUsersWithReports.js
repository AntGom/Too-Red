import Publication from "../../models/publicationModel.js";

const getUsersWithReports = async (req, res) => {
  try {
    // Verificar que el usuario tiene rol de 'admin'
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado. Solo los administradores pueden realizar esta acción.",
      });
    }

    // Parámetros de la consulta
    const { reportStatus } = req.query;

    // Filtro dinámico para los parámetros de búsqueda
    const filter = {
      // Filtra publicaciones con reportes y el estado del reporte
      ...(reportStatus ? { "reports.status": reportStatus } : {}),
    };

    // Usuarios con publicaciones reportadas y filtradas
    const usersWithReports = await Publication.aggregate([
      { 
        $match: { 
          "reports.0": { $exists: true }, // Asegurarse de que haya reportes en la publicación
          ...filter // Aplicar los filtros adicionales
        }
      },
      {
        $group: {
          _id: "$user", // Agrupar por el usuario
          reportedPublications: { $push: "$$ROOT" }, // Incluir todas las publicaciones reportadas del usuario
        },
      },
      {
        $lookup: {
          from: "users", // Unir con la colección de usuarios
          localField: "_id", // Campo local (ID de usuario)
          foreignField: "_id", // Campo en la colección de usuarios
          as: "userInfo", // Alias para la información del usuario
        },
      },
      { $unwind: "$userInfo" }, // Descomponer el array de usuarios
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          nick: "$userInfo.nick",
          email: "$userInfo.email",
          reportedPublications: 1, // Incluir las publicaciones reportadas
          reportedCount: { $size: "$reportedPublications" }, // Contador de publicaciones reportadas
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: usersWithReports,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios con publicaciones reportadas",
      error: error.message,
    });
  }
};

export default getUsersWithReports;
