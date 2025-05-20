import cloudinary from "cloudinary";
import fs from "fs";
import os from "os";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPublicationImage = async (file) => {
  try {
    if (!file) {
      throw new Error("No se ha incluido ninguna imagen");
    }

    //Carpeta temporal
    const tmpDir = os.tmpdir();
    const tempPath = path.join(tmpDir, file.name);

    //Mover archivo temporalmente
    await file.mv(tempPath);

    //Subir imagen en publications
    const result = await cloudinary.v2.uploader.upload(tempPath, {
      resource_type: "auto",
      width: 500,
      crop: "limit",
      folder: "publications",
    });

    //Eliminar el archivo temporal
    fs.unlinkSync(tempPath);

    return result.secure_url;
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary", error);
    throw new Error("Error al procesar la subida de imagen");
  }
};
