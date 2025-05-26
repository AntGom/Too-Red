import User from "../../models/userModel.js";
import bcrypt from "bcrypt";

const update = async (req, res) => {
  try {
    const userId = req.user.id;

    const updateData = req.body;

    //Si se actualiza la contraseña, cifrarla
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    // Buscar y actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Devuelve el documento actualizado
      runValidators: true, // Ejecuta las validaciones
      select: " -role",
    });

    // Verificar si se encontró y actualizó el usuario
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar el usuario",
    });
  }
};

export default update;
