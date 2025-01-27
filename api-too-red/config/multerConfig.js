import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinayConfig.js";

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folderName = "uploads"; // Default folder
    if (req.body.type === "avatar") {
      folderName = "avatars";
    } else if (req.body.type === "publication") {
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
