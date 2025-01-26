import User from "../../models/userModel.js";
import cloudinary from "../../config/cloudinayConfig.js"; 

const upload = async (req, res) => {
    try {
      //Verificar si hay archivo
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No se ha incluido ninguna imagen para la actualización",
        });
      }

      //Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        use_filename: true,
        unique_filename: false,
      });

      //Guardar  URL de  imagen en BBDD
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { image: result.secure_url }, //Guardar  URL en vez del nombre del archivo
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado",
        });
      }

      //Responder con URL de imagen subida
      return res.status(200).json({
        status: "success",
        message: "Imagen subida correctamente",
        user: user,
        file: result.secure_url, //Devuelve URL de Cloudinary
      });
    } catch (error) {
      console.error("Error en la subida de imagen:", error);
      return res.status(500).json({
        status: "error",
        message: "Error al procesar la subida de imagen",
      });
    }
};

export default upload;
