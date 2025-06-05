import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const conection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});

    console.log("🟢 Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("🔴 Error al conectar con MongoDB Atlas:", error);
    throw new Error("Error al conectar con la BBDD");
  }
};

export default conection;
