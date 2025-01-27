import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinayConfig.js";

//Configuración almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars", 
    format: async (req, file) => "png, jpg, webp",
    public_id: (req, file) => "file-" + Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

export default upload;
