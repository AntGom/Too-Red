import mongoose from "mongoose";
import dotenv from "dotenv";  // Asegúrate de importar dotenv

dotenv.config();  // Cargar las variables de entorno

const conection = async () => {
    try {
        // Usamos la URI de MongoDB Atlas desde las variables de entorno
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("🟢 Conectado a MongoDB Atlas");

    } catch (error) {
        console.error("🔴 Error al conectar con MongoDB Atlas:", error);
        throw new Error("Error al conectar con la BBDD");
    }
}

export default conection;
