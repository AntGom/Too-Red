import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinayConfig.js";

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "uploads"; // Carpeta por defecto

    if (file.mimetype.startsWith("image")) {
      folderName = "avatars";
    } else {
      folderName = "publications";
    }

    return {
      folder: folderName,
      format: "auto",
      public_id: "file-" + Date.now(),
    };
  },
});


const upload = multer({ storage });

export default upload;
