import { Schema, model } from "mongoose";
import softDeletePlugin from "../plugins/softDeletePlugin.js";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 2000 },
    file: { type: String, default: null }, //Para enviar imágenes/pdf...
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    isSeen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

MessageSchema.index({ sender: 1, receiver: 1, createdAt: 1 }); //Optimizar búsqueda entre usuarios
MessageSchema.index({ createdAt: 1 }); //Optimizar búsqueda por fecha

MessageSchema.plugin(softDeletePlugin);

const Message = model("Message", MessageSchema, "messages");

export default Message;
