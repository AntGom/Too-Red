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
  
      //Carpeta temporal segura
      const tmpDir = os.tmpdir();
      const tempPath = path.join(tmpDir, img.name);
  
      //Mover archivo temporalmente
      await img.mv(tempPath);
  
      //Subir imagen carpeta avatars
      const result = await cloudinary.uploader.upload(tempPath, {
        resource_type: 'auto',
        width: 500,  
        crop: 'limit',
        folder: 'avatars',
      });
  
      //Eliminar archivo temporal
      fs.unlinkSync(tempPath);
  
      return result.secure_url;
    } catch (err) {
      console.error('Error al subir la imagen a Cloudinary:', err);
      throw err;
    }
  };
  
