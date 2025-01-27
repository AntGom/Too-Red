import User from "../../models/userModel.js";

const upload = async (req, res) => {
  try {
    console.log("Archivo recibido:", req.file); // <-- Imprime el archivo recibido en los logs de Render

    // Verificar si hay archivo
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No se ha incluido ninguna imagen para la actualización",
      });
    }

    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      use_filename: true,
      unique_filename: false,
    });

    console.log("Cloudinary response:", result); // <-- Imprime la respuesta de Cloudinary en los logs

    // Guardar URL de imagen en la BBDD
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: result.secure_url }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    // Responder con la URL de la imagen subida
    return res.status(200).json({
      status: "success",
      message: "Imagen subida correctamente",
      user,
      file: result.secure_url, // Devuelve URL de Cloudinary
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
