import User from "../../../models/userModel.js";
import Follow from "../../../models/followModel.js";

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;

    if (!query || query.trim().length < 2) {
      return res.status(200).json({
        status: "success",
        users: [],
      });
    }

    // Buscar usuarios que el usuario actual sigue
    const follows = await Follow.find({ user: currentUserId });
    const followedIds = follows.map(follow => follow.followed.toString());

    // Añadir ID del usuario
    followedIds.push(currentUserId);

    // Buscar usuarios que coincidan con la consulta y que el usuario siga
    const users = await User.find({
      $and: [
        { _id: { $in: followedIds } },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { nick: { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .select("_id name nick image")
      .limit(5);

    return res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al buscar usuarios",
      error: error.message,
    });
  }
};

export default searchUsers;