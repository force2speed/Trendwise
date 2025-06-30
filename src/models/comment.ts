import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  articleSlug: { type: String, required: true },
  user: {
    name: String,
    email: String,
    image: String,
  },
  content: { type: String, required: true }, // renamed from "comment" to "content"
  createdAt: {
    type: Date,
    default: Date.now, // fixed typo here
  },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
