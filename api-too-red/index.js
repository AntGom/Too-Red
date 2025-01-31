import dotenv from "dotenv";
import conection from "./database/conection.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import filterDeleted from "./middlewares/filterDeleted.js";
import expressFileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import path from "path";
import os from "os";
import "./services/CleanUp.js";

dotenv.config();
conection();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const tempDir = path.join(os.tmpdir(), "uploads");

//Middleware para archivos subidos
app.use(expressFileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ruta para acceder a los archivos
app.use("/uploads", express.static("uploads"));

app.use(filterDeleted);
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
