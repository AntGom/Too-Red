import Message from "../../models/messagesModel.js";
import { io } from "../../index.js";

//Mapa para conexiones activas
const activeUsers = new Map();

const newMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  try {
    //Crear mensaje en BBDD
    const newMessage = new Message({
      sender,
      receiver,
      text,
      isDelivered: false, //Inicialmente marcado como no entregado
    });

    await newMessage.save();

    //Verificar si receptor conectado
    if (activeUsers.has(receiver)) {
      //Receptor  conectado->Emitir el mensaje
      io.to(receiver).emit('newMessage', {
        sender,
        receiver,
        text,
        createdAt: newMessage.createdAt,
        isRead: false, //Mensaje es nuevo,no leído
      });
      newMessage.isDelivered = true; //El mensaje ha sido entregado
      await newMessage.save();
    } else {
      //Receptor no está conectado->almacenar mensaje para más tarde
      console.log(`El receptor ${receiver} no está conectado. El mensaje se guardó para cuando se conecte.`);
    }

    return res.status(201).json({ message: "Mensaje enviado correctamente", data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

export default newMessage;
