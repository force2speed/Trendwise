"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticle() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to the new article page
        router.push(`/article/${data.slug}`);
      } else {
        alert(data.error || "Failed to generate article.");
      }
    } catch (err) {
      alert("An unexpected error occurred."+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📝 Generate a New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter a trending topic..."
          className="w-full p-3 border border-gray-300 rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Article"}
        </button>
      </form>
    </div>
  );
}
