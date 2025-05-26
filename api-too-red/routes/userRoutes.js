import { Router } from "express";
import { userController } from "../controllers/userControllers/userControllers.js";
import { followControllers } from "../controllers/followControllers/followController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/register", userController.register);
router.get("/confirm/:token", userController.confirmRegistration);
router.post("/login", userController.login);
router.get("/avatar/:file", userController.avatar);

// Rutas de recuperación de contraseña
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

// Rutas de recuperación de cuenta
router.post("/request-recovery", userController.requestAccountRecovery);
router.post("/recover-account", userController.recoverAccount);

// Auth Routes
router.get("/profile/:id", auth, userController.profile);
router.get("/list/:page?", auth, userController.list);
router.put("/update", auth, userController.update);

// Subida de archivos
router.post("/upload", [auth], userController.upload);

// Contadores seguidores
router.get("/counters/:id", auth, followControllers.counter);

// Eliminar usuario
router.delete("/delete/:id", auth, userController.deleteUser);

// Solo Admins
router.put("/ban/:id", auth, userController.banUser);
router.put("/unban/:id", auth, userController.unbanUser);

export default router;
