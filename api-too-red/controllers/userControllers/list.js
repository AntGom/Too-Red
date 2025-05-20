import User from "../../models/userModel.js";
import { followUserIds as getFollowUserIds } from "../../services/followService.js";

const list = async (req, res) => {
  try {
    let page = parseInt(req.params.page) || 1;
    let itemsPerPage = 6;

    const skip = (page - 1) * itemsPerPage;

    // Añadir esta condición para excluir admins
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password -role -__v")
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    const total = await User.countDocuments({ role: { $ne: "admin" } });
    let followData = await getFollowUserIds(req.user.id);

    return res.status(200).json({
      status: "success",
      page,
      itemsPerPage,
      total,
      pages: Math.ceil(total / itemsPerPage),
      users,
      user_following: followData.following,
      user_follow_me: followData.followers,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la lista de usuarios",
      error: error.message,
    });
  }
};

export default list;
