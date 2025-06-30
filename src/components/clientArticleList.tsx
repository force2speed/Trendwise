"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientArticleList({ articles }: { articles: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.meta?.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">📰 Latest Articles</h1>

      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border border-gray-300 rounded"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-600">No articles found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((article) => (
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
