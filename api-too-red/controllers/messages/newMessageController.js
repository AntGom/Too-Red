import Message from "../../models/messagesModel.js";
import { io } from "../../index.js";
import cloudinary from "cloudinary";

const activeUsers = new Map();

const newMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;
  let fileUrl = null;

  try {
    // Si hay archivo, subir a Cloudinary
    if (req.files?.file) {
      const file = req.files.file;
      const uploadResult = await cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: "chat_messages",
          resource_type: "auto",
        }
      );

      fileUrl = uploadResult.secure_url;
    }

    // Crear mensaje con/sin archivo
    const newMessage = new Message({
      sender,
      receiver,
      text,
      file: fileUrl,
      isDelivered: false,
      isRead: false,
    });

    await newMessage.save();

    // Emitir por socket si receptor online
    const receiverSockets = await io.in(receiver).fetchSockets();

    if (receiverSockets.length > 0) {
      io.to(receiver).emit("newMessage", {
        _id: newMessage._id,
        sender,
        receiver,
        text,
        file: newMessage.file,
        createdAt: newMessage.createdAt,
        isRead: false,
      });

      newMessage.isDelivered = true;
      await newMessage.save();
    }

    // Responder al cliente
    return res.status(201).json({
      message: "Mensaje enviado correctamente",
      data: {
        _id: newMessage._id,
        sender,
        receiver,
        text,
        file: newMessage.file,
        createdAt: newMessage.createdAt,
        isRead: false,
        isDelivered: newMessage.isDelivered,
      },
    });
  } catch (error) {
    console.error("❌ Error al enviar el mensaje:", error);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

export default newMessage;
