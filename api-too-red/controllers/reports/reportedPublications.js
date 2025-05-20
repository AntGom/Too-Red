import Publication from "../../models/publicationModel.js";

const getReportedPublications = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "Acceso denegado. Solo los administradores pueden realizar esta acción.",
      });
    }

    const reportedPublications = await Publication.find({ reportCount: { $gt: 0 } })
      .select("text file reports createdAt user")
      .populate({
        path: "user",
        select: "nick email",
      })
      .populate({
        path: "reports.user",
        select: "nick email",
      });

    return res.status(200).send({
      status: "success",
      data: reportedPublications,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener las publicaciones denunciadas",
      error: error.message,
    });
  }
};

export default getReportedPublications;
