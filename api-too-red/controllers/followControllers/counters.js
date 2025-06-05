import Follow from "../../models/followModel.js";
import Publication from "../../models/publicationModel.js";

const counter = async (req, res) => {
  let userId = req.user._id;
  if (req.params.id) userId = req.params.id;

  try {
    // Seguidores (usuarios que siguen al userId)
    const rawFollowers = await Follow.find({ followed: userId }).populate("user", "isDeleted deletedAt");
    const followers = rawFollowers.filter(f => f.user && !f.user.isDeleted && !f.user.deletedAt).length;

    // Seguidos válidos (usuarios que el userId sigue)
    const rawFollowing = await Follow.find({ user: userId }).populate("followed", "isDeleted deletedAt");
    const following = rawFollowing.filter(f => f.followed && !f.followed.isDeleted && !f.followed.deletedAt).length;

    // Publicaciones activas
    const publications = await Publication.countDocuments({
      user: userId,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false },
      ],
      $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: null },
      ],
    });

    return res.status(200).send({
      userId,
      following,
      followers,
      publications,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener los contadores",
      error: error.message,
    });
  }
};

export default counter;
