import Follow from "../../models/followModel.js";
import { followUserIds } from "../../services/followService.js";

const following = async (req, res) => {
  try {
    let userId = req.user.id;

    if (req.params.id) userId = req.params.id;

    const options = {
      populate: [
        { path: "user", select: "-password -role -__v" },
        { path: "followed", select: "-password -role -__v" },
      ],
      sort: { created_at: -1 },
    };

    // Find a follow, popular datos de user y no usar paginación
    const result = await Follow.find(
      { user: userId, isDeleted: false },
      null,
      options
    );

    // Sacar array de ids que me siguen y los que sigo yo
    let followUserIdsResult = await followUserIds(req.user.id);

    return res.status(200).send({
      status: "success",
      message: "Lista completa de usuarios que estoy siguiendo",
      follows: result,
      user_following: followUserIdsResult.following,
      user_follow_me: followUserIdsResult.followers,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al obtener la lista de usuarios que estoy siguiendo",
      error: error.message,
    });
  }
};

export default following;
