import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import ClientArticleList from "@/components/clientArticleList";
import "./globals.css";
import Image from "next/image";

export default async function Homepage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const articles = await Article.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📰 Welcome to TrendWise</h1>

      {session ? (
        <div className="mb-6">
          <p className="text-lg">Hello, {session.user?.name} 👋</p>
          
<Image
  src={session.user?.image || "/default.jpg"}
  alt="Profile"
  width={96}
  height={96}
  className="mx-auto mt-4 rounded-full w-24 h-24 mb-4"
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

      <ClientArticleList articles={JSON.parse(JSON.stringify(articles))} />
    </main>
  );
}
