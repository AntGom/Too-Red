import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: String,
  bio: String,
  nick: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "role_user" },
  image: { type: String, default: "default.png" },
  confirmed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  isBanned: { type: Boolean, default: false },
  interests: { type: [String], default: [] },
});

const User = model("User", UserSchema, "users");

export default User;
