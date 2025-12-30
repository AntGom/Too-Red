import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import softDeletePlugin from "../plugins/softDeletePlugin.js";

const FollowSchema = new Schema(
  {
    user: { type: Schema.ObjectId, ref: "User" },
    followed: { type: Schema.ObjectId, ref: "User" },
    created_at: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { versionKey: false }
);

FollowSchema.plugin(mongoosePaginate);
FollowSchema.plugin(softDeletePlugin);

const Follow = model("Follow", FollowSchema, "follows");

export default Follow;
