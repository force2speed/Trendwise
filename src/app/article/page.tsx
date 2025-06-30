import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import Link from "next/link";
import dayjs from "dayjs";
import "../globals.css";
import Image from "next/image";
interface Article {
  _id: string;
  slug: string;
  title: string;
  meta: {
    description: string;
  };
  createdAt: string | Date;
}
interface ArticleType {
  _id: string;
  slug: string;
  title: string;
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  createdAt: string | Date;
}


export default async function Homepage() {
  const session = await getServerSession(authOptions);

  await connectDB();
 const articles = await Article.find().sort({ createdAt: -1 }).lean() as unknown as ArticleType[];

  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📰 Welcome to TrendWise</h1>

      {session ? (
        <div className="mb-6">
          <p className="text-lg">Hello, {session.user?.name} 👋</p>
         <Image
  src={session.user?.image || "/default-avatar.png"}
  alt="Profile"
  width={96}
  height={96}
  className="mx-auto mt-4 rounded-full w-24 h-24 mb-4"
  unoptimized // optional: disable optimization for external URLs
/>
          <form
            action="/api/article"
            method="POST"
            className="max-w-md mx-auto space-y-4 mt-4"
          >
            <input
              type="text"
              name="topic"
              placeholder="Enter blog topic..."
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Generate Blog Article
            </button>
          </form>
        </div>
      ) : (
        <a
          href="/login"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-6"
        >
          Login with Google
        </a>
      )}

      <div className="max-w-3xl mx-auto text-left space-y-6 mt-8">
        {articles.map((article) => (
          <Link href={`/article/${article.slug}`} key={article._id}>
            <div className="p-4 border rounded hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600">{article.meta?.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                {dayjs(article.createdAt).format("YYYY-MM-DD")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
