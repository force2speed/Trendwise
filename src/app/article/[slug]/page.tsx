import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import Comments from "@/app/components/comment";

type ArticleType = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  media: string[];
  createdAt: string | Date;
};
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  await connectDB();

  const article = await Article.findOne({ slug }).lean() as unknown as ArticleType;
  if (!article) return {};

  return {
    title: article.meta.title,
    description: article.meta.description,
    openGraph: {
      images: [article.meta.ogImage],
    },
  };
}

export default async function ArticlePage(props: Props) {
  const { slug } = await props.params;
  await connectDB();

  const article = await Article.findOne({ slug }).lean() as unknown as ArticleType;
  if (!article) return notFound();

  return (
    <div className="prose max-w-3xl mx-auto p-6">
      <h1>{article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {new Date(article.createdAt).toISOString().slice(0, 10)}
      </div>
      <div className="prose">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {article.media?.length > 0 && (
        <div className="mt-8">
          <h3>Media</h3>
          <ul>
            {article.media.map((link: string) => (
              <li key={link}>
                <a href={link} className="text-blue-600 underline" target="_blank">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Comments articleId={article._id.toString()} />
    </div>
  );
}
