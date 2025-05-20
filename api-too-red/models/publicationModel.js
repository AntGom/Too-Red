import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ReportSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ["active", "reverted"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const PublicationSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  file: String,
  likes: [{ type: Schema.ObjectId, ref: "User", unique: true }],
  likesCount: { type: Number, default: 0 },
  comments: [CommentSchema],
  reports: [ReportSchema],
  reportCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

//Middleware actualizar contador de likes
PublicationSchema.pre("save", function (next) {
  this.likesCount = this.likes.length;
  this.reportCount = this.reports.length;
  next();
});

PublicationSchema.plugin(mongoosePaginate);

const Publication = model("Publication", PublicationSchema, "publications");

export default Publication;
