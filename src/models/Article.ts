import mongoose, { Schema, Document, models, model } from "mongoose";
import { Types } from "mongoose";
interface ArticleType extends Document {
  title: string;
  slug: string;
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  content: string;
  media: string[];
  createdAt: Date;
}

const ArticleSchema = new Schema<ArticleType>({
    _id: Types.ObjectId,
  title: String,
  slug: String,
  meta: {
    title: String,
    description: String,
    ogImage: String,
  },
  content: String,
  media: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Article || model<ArticleType>("Article", ArticleSchema);
