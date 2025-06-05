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
import { Server } from "socket.io";
import "./services/CleanUp.js";

dotenv.config();
conection();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = createServer(app);

// Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const activeUsers = new Map();

const tempDir = path.join(os.tmpdir(), "uploads");
app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: tempDir,
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(filterDeleted);
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/messages", messagesRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("✅ Usuario conectado:", socket.id);

  socket.on("joinRoom", (userId) => {
    if (!userId) {
      console.error("❌ joinRoom: userId inválido");
      return;
    }

    try {
      activeUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(
        `✅ Usuario ${userId} se unió a la sala (socketId: ${socket.id})`
      );

      // Notificar a todos la lista completa de usuarios online
      io.emit("onlineUsers", Array.from(activeUsers.keys()));

      // Notificar a los contactos que el usuario está ahora online
      socket.broadcast.emit("userStatusChange", {
        userId,
        isOnline: true,
      });

      socket.emit("joinedRoom", { userId });
    } catch (error) {
      console.error("❌ Error en joinRoom:", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      let userIdDisconnected = null;

      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          userIdDisconnected = userId;
          activeUsers.delete(userId);
          break;
        }
      }

      if (userIdDisconnected) {
        console.log(`🔌 Usuario desconectado: ${userIdDisconnected}`);

        // Emitir lista actualizada de usuarios online
        io.emit("onlineUsers", Array.from(activeUsers.keys()));

        // Notificar a los contactos que el usuario está ahora offline
        io.emit("userStatusChange", {
          userId: userIdDisconnected,
          isOnline: false,
        });
      }
    } catch (error) {
      console.error("❌ Error al manejar disconnect:", error);
    }
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Servidor funcionando correctamente",
    socketConnections: io.engine.clientsCount,
    activeUsers: [...activeUsers.entries()].length,
  });
});

const PORT = process.env.PORT || 3900;
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
