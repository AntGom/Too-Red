import Message from "../../models/messagesModel.js";

const getMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    //Busca todos mensajes entre dos usuarios
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
      isDeleted: false // Filtrar eliminados
    })
      .sort({ createdAt: 1 }); //Ordenar por fecha ascendente

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los mensajes" });
  }
};

export default getMessages;
