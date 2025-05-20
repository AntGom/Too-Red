import Follow from "../../models/followModel.js";
import { followUserIds } from "../../services/followService.js";

const followersList = async (req, res) => {
  try {
    // Obtener el ID del usuario logueado o el que viene por params
    let userId = req.user.id;
    if (req.params.id) userId = req.params.id;

    // Obtener todos los seguidores sin paginación
    const follows = await Follow.find({ followed: userId })
      .populate("user", "-password -role -__v")
      .populate("followed", "-password -role -__v")
      .sort({ created_at: -1 });

    // Obtener los IDs de los seguidores y seguidos
    const followUserIdsResult = await followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Lista de usuarios que me siguen",
      total: follows.length, // Cantidad total de seguidores
      follows,
      user_following: followUserIdsResult.following,
      user_follow_me: followUserIdsResult.followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la lista de seguidores",
      error: error.message,
    });
  }
};

export default followersList;
