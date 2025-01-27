import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinayConfig.js";

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folderName = "too-red";

    //Determinar folder por tipo archivo
    if (req.body.type === "avatar") {
      folderName = "avatars";
    } else if (req.body.type === "publication") {
      folderName = "publications";
    }

    return {
      folder: folderName, 
      format: async (req, file) => {
        // Permitir múltiples formatos
        const allowedFormats = ["png", "jpg", "jpeg", "webp", "gif", "bmp"];
        return allowedFormats.join(", ");
      },
      public_id: (req, file) => "file-" + Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

export default upload;
