import Publication from "../../models/publicationModel.js";
import cloudinary from "../../config/cloudinayConfig.js";

const upload = async (req, res) => {
    try {
        const publicationId = req.params.id;

        //Comprobar si hay un archivo cargado
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se ha incluido ninguna imagen",
            });
        }

        //Subir imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "publications", //Carpeta en Cloudinary
            use_filename: true,
            unique_filename: false,
        });

        //Guardar la URL de Cloudinary en BBDD
        const publication = await Publication.findOneAndUpdate(
            { "user": req.user.id, "_id": publicationId },
            { file: result.secure_url },  //Guarda URL de Cloudinary
            { new: true }
        )
        .populate("user", "name")
        .select("createdAt user file");

        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "Publicación no encontrada",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Imagen subida correctamente",
            publication,
        });

    } catch (error) {
        console.error("Error en la subida de imagen:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al procesar la subida de imagen",
            error: error.message,
        });
    }
};

export default upload;
