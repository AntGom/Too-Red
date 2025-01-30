import dotenv from "dotenv";
import conection from "./database/conection.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import filterDeleted from "./middlewares/filterDeleted.js";
import "./services/CleanUp.js";

dotenv.config();
conection();

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(filterDeleted);
app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

const PORT = process.env.PORT || 3900;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
