import { savePhotoService } from '../../services/avatarService.js';
import User from '../../models/userModel.js';

const uploadAvatarController = async (req, res) => {
  try {

    if (!req.files || !req.files.avatar) {
      return res.status(400).send({ message: "No se ha enviado una imagen de avatar" });
    }

    const avatarFile = req.files.avatar;

    const imageUrl = await savePhotoService(avatarFile);

    //Guarda URL en BBDD
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { image: imageUrl },
      { new: true }
    );

    if (!user) {
      console.log("Usuario no encontrado:", req.user.id);
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    return res.status(200).send({
      status: "success",
      message: "Imagen de avatar subida correctamente",
      user,
      imageUrl,
    });
  } catch (err) {
    console.error("Error al subir la imagen:", err);
    return res.status(500).send({ message: "Error al subir la imagen" });
  }
};

export default uploadAvatarController;
