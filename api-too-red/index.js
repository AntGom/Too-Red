import dotenv from "dotenv";
import conection from "./database/conection.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import filterDeleted from "./middlewares/filterDeleted.js";
import expressFileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import path from "path";
import os from "os";
import { createServer } from "http";
import {Server} from "socket.io";
import "./services/CleanUp.js";

dotenv.config();
conection();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Crear servidor HTTP
const server = createServer(app);

//Servidor de Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Mapa para almacenar conexiones activas
const activeUsers = new Map();

// Middleware para archivos subidos
const tempDir = path.join(os.tmpdir(), "uploads");
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

app.use("/uploads", express.static("uploads"));

app.use(filterDeleted);
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/messages", messagesRoutes);

//Socket.io
io.on('connection', (socket) => {
  console.log("Usuario conectado: " + socket.id);

  //Unirse a una sala para un usuario
  socket.on('joinRoom', (userId) => {
    activeUsers.set(userId, socket.id);  //Guardar conexión activa
    socket.join(userId);
    console.log(`Usuario ${userId} se unió a la sala`);
  });
  

  //Escuchar eventos de nuevos mensajes
  socket.on('newMessage', (data) => {
    console.log("Nuevo mensaje recibido:", data);

    //Emitir el evento a la sala del receptor
    io.to(data.receiver).emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    activeUsers.forEach((value, key) => {
      if (value === socket.id) {
        activeUsers.delete(key);
        console.log(`Usuario ${key} desconectado`);
      }
    });
    console.log('Usuario desconectado');
  });
  
});

const PORT = process.env.PORT || 3900;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
