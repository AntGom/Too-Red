import User from "../../models/userModel.js";
import Publication from "../../models/publicationModel.js";
import Follow from "../../models/followModel.js";
import mongoose from "mongoose";
import { sendEmail } from "../../services/emailService.js";

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const loggedUserId = req.user.id;

  if (id !== loggedUserId) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar otro perfil" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de usuario no válido" });
  }

  try {
    // Actualiza el estado de eliminación lógica del usuario
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualiza publicaciones y follows asociados
    await Promise.all([
      Publication.updateMany(
        { user: id },
        { isDeleted: true, deletedAt: new Date() }
      ),
      Follow.updateMany(
        { $or: [{ user: id }, { followed: id }] },
        { isDeleted: true, deletedAt: new Date() }
      ),
    ]);

    // Envía un correo al usuario informándole de la suspensión de su cuenta
    const emailSubject = "Cuenta en proceso de eliminación - Too-Red";
    const emailBody = `
    <h1>Cuenta en proceso de eliminación</h1>
    <p>Hola ${user.name},</p>
    <p>Queremos informarte que tu cuenta ha sido marcada para ser eliminada. A partir de hoy, cuentas con un período de suspensión de <strong>30 días</strong>.</p>
    <p>Si deseas cancelar este proceso y recuperar tu cuenta, por favor, accede a la página de inicio de sesión y sigue las instrucciones antes de que finalice este período.</p>
    <p>Una vez transcurridos los 30 días, tu cuenta será eliminada de forma permanente y no podrá ser recuperada.</p>
    <p>Gracias por confiar en Too-Red.</p>
    <p><strong>El equipo de Too-Red</strong></p>

    `;

    await sendEmail(user.email, emailSubject, emailBody);

    res
      .status(200)
      .json({ message: "Usuario eliminado correctamente (soft delete)" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

export default deleteUser;
