import { Router } from "express";
import { messagesController } from "../controllers/messages/messagesController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/new", auth, messagesController.newMessage);
router.get("/:userId1/:userId2", auth, messagesController.getMessages);

export default router;