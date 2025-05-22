import { Router } from "express";
import { messagesController } from "../controllers/messages/messagesController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/new", auth, messagesController.newMessage);
router.get("/unread", auth, messagesController.getUnreadCount);
router.put("/markAsRead/:senderId", auth, messagesController.markAsRead);
router.get("/:userId1/:userId2", auth, messagesController.getMessages);
router.delete("/:messageId", auth, messagesController.deleteMessage);

export default router;