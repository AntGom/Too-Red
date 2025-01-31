import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import os from 'os';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const savePhotoService = async (img) => {
  try {
    if (!img || !img.name) {
      throw new Error('La imagen no contiene un nombre válido.');
    }

    // Carpeta temporal para el archivo
    const tmpDir = os.tmpdir();
    const tempPath = path.join(tmpDir, img.name);

    // Mover el archivo a la carpeta temporal
    await img.mv(tempPath);

    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      resource_type: 'auto',  // Permite la carga de cualquier tipo de archivo
      width: 500,
      crop: 'limit',  // Limitar el tamaño de la imagen
    });

    // Eliminar el archivo temporal
    fs.unlinkSync(tempPath);

    // Retornar la URL de la imagen subida
    return result.secure_url;
  } catch (err) {
    console.error('Error al subir la imagen a Cloudinary:', err);
    throw err;  // Lanzar el error para manejarlo en el controlador
  }
};
