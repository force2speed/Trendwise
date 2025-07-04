import  { Schema, Document, models, model } from "mongoose";
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
