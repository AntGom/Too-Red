import User from "../../models/userModel.js";
import bcrypt from "bcrypt";

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Buscar user por token y verificar si ha expirado
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "El token de recuperación es inválido o ha expirado",
      });
    }

    // Actualizar la contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).send({
      status: "success",
      message: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error al resetear la contraseña",
      error: error.message,
    });
  }
};

export default resetPassword;
