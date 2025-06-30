import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

import Comments from "@/components/comment";
type ArticleType = {
  _id: string,
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
  params: {
    slug: string;
  };
};

// Optional: For SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params; // 👈 Await params
  await connectDB();
 const article = await Article.findOne({ slug: params.slug }).lean() as unknown as ArticleType;

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
  const params = await props.params; // 👈 Await params
  await connectDB();

const article = await Article.findOne({ slug: params.slug }).lean() as unknown as {
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


  if (!article) return notFound();

  return (
    <div className="prose max-w-3xl mx-auto p-6">
      <h1>{article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {new Date(article.createdAt).toLocaleString()}
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

// 🔽 Simple markdown to HTML converter
function parseMarkdownToHTML(content: string): string {
  return content
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\n$/gim, "<br />");
}
