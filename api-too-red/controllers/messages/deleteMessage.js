import Message from "../../models/messagesModel.js";
import User from "../../models/userModel.js";

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    const user = await User.findById(userId);

    // Solo si usuario es owner o admin
    if (message.sender.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ message: "No tienes permiso para borrar este mensaje" });
    }

    // Eliminación lógica
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    return res.status(200).json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar mensaje", error });
  }
};

export default deleteMessage;
