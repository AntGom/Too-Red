import newMessage from "./newMessageController.js";
import getMessages from "./getMessagesController.js";
import getUnreadCount from "./getUnreadMessages.js";
import markAsRead from "./markAsRead.js";
import deleteMessage from "./deleteMessage.js";

export const messagesController = {
  newMessage,
  getMessages,
  getUnreadCount,
  markAsRead,
  deleteMessage,
};
