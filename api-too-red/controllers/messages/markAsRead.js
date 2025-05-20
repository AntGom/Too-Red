import Message from "../../models/messagesModel.js";
import mongoose from "mongoose";
import { io } from "../../index.js";

const markAsRead = async (req, res) => {
  const { senderId } = req.params;
  const receiverId = req.user.id;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "ID de remitente no válido" 
      });
    }

    // Actualiza todos los mensajes no leídos de un remitente específico
    const result = await Message.updateMany(
      { 
        sender: senderId,
        receiver: receiverId,
        isRead: false 
      },
      { isRead: true }
    );
    
    // Emitir evento de mensaje leído al remitente para actualizar doble check
    if (result.modifiedCount > 0) {
      io.to(senderId).emit('messageRead', {
        sender: senderId,
        receiver: receiverId
      });
    }
    
    return res.status(200).json({
      status: "success",
      message: "Mensajes marcados como leídos",
      count: result.modifiedCount
    });
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al marcar mensajes como leídos"
    });
  }
};

export default markAsRead;