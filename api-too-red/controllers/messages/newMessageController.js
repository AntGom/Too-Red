import Message from "../../models/messagesModel.js";
import { io } from "../../index.js";

//Mapa para conexiones activas
const activeUsers = new Map();

const newMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  try {
    const newMessage = new Message({
      sender,
      receiver,
      text,
      isDelivered: false,
      isRead: false,
    });

    await newMessage.save();

    // Verificar si el receptor está conectado usando el io.sockets.adapter
    const receiverSockets = await io.in(receiver).fetchSockets();
    
    if (receiverSockets.length > 0) {
      // Receptor conectado - emitir mensaje
      io.to(receiver).emit('newMessage', {
        _id: newMessage._id,
        sender,
        receiver,
        text,
        createdAt: newMessage.createdAt,
        isRead: false,
      });
      
      newMessage.isDelivered = true;
      await newMessage.save();
    }

    return res.status(201).json({ 
      message: "Mensaje enviado correctamente", 
      data: {
        _id: newMessage._id,
        sender,
        receiver,
        text,
        createdAt: newMessage.createdAt,
        isRead: false,
        isDelivered: newMessage.isDelivered
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

export default newMessage;