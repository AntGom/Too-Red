import User from "../../models/userModel.js";

const avatar = async (req, res) => {
  try {
    const userId = req.params.id;

    //Buscar  usuario en BBDD
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    //Si usuario tiene avatar, devolver URL de Cloudinary
    if (user.image) {
      return res.status(200).json({
        status: "success",
        avatarUrl: user.image,  //URL de Cloudinary  en BBDD
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "El usuario no tiene avatar",
      });
    }
  } catch (error) {
    console.error("Error al obtener el avatar:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el avatar del usuario",
    });
  }
};

export default avatar;
