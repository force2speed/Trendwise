import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
import Link from "next/link";
export default async function ArticlesPage() {
  await connectDB();

  const articles = await Article.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📰 Latest Articles</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">No articles yet. Start by creating one!</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article: any) => (
            <li key={article._id} className="border-b pb-4">
              <Link href={`/article/${article.slug}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {article.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mb-1">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{article.meta?.description || "No description provided."}</p>
            </li>
          ))}
        </ul>
      )}

    </main>
  );
}
