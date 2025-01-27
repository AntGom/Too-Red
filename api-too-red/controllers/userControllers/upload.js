import User from "../../models/userModel.js";

const upload = async (req, res) => {
    try {
        //Verificar si hay archivo
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se ha incluido ninguna imagen para la actualización",
            });
        }

        //Obtener URL de imagen de Cloudinary (subida por Multer)
        const imageUrl = req.file.path;

        //Guardar URL en BBDD
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { image: imageUrl }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado",
            });
        }

        //Responder con  URL de imagen
        return res.status(200).json({
            status: "success",
            message: "Imagen subida correctamente",
            user,
            file: imageUrl,
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
