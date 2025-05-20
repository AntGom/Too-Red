import User from "../../models/userModel.js";
import Publication from "../../models/publicationModel.js";
import Follow from "../../models/followModel.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

const recoverAccount = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { email } = decoded;

    const user = await User.findOne({ email, isDeleted: true });

    if (!user || user.isDeleted === false) {
      return res.status(400).json({
        message: "Usuario no encontrado o ya está activo.",
      });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();

    await Promise.all([
      Publication.updateMany({ user: user._id, isDeleted: true }, { isDeleted: false, deletedAt: null }),
      Follow.updateMany(
        { $or: [{ user: user._id }, { followed: user._id }], isDeleted: true },
        { isDeleted: false, deletedAt: null }
      ),
    ]);

    res.status(200).json({ message: "Cuenta recuperada con éxito." });
  } catch (error) {
    res.status(400).json({ message: "Token inválido o expirado." });
  }
};


export default recoverAccount;
