import Publication from "../../models/publicationModel.js";
import { uploadPublicationImage } from "../../services/imgPublicationService.js";

const upload = async (req, res) => {
    try {
        const publicationId = req.params.id;
        const file = req.files?.file;

        // Subir imagen usando el servicio
        const imageUrl = await uploadPublicationImage(file);

        // Guardar la URL en la base de datos
        const publication = await Publication.findOneAndUpdate(
            { user: req.user.id, _id: publicationId },
            { file: imageUrl },
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
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

export default upload ;
