import Message from "../../models/messagesModel.js";

const getUnreadCount = async (req, res) => {
  const userId = req.user.id;
  
  try {
    // Obtener si hay mensajes no leídos, sin contar
    const hasUnreadMessages = await Message.exists({
      receiver: userId,
      isRead: false
    });
    
    // Obtener los remitentes con mensajes no leídos
    const sendersWithUnread = await Message.distinct("sender", {
      receiver: userId,
      isRead: false
    });
    
    return res.status(200).json({
      status: "success",
      hasUnread: hasUnreadMessages,
      sendersWithUnread
    });
  } catch (error) {
    console.error("Error al obtener mensajes no leídos:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener mensajes no leídos"
    });
  }
};

export default getUnreadCount;