"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Comment = {
  _id: string;
  content: string;
  user: {
    name: string;
    image?: string;
  };
  createdAt: string;
};

export default function Comments({
  articleId,
}: {
  articleId: string;
})  {
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
  fetch(`/api/comment?articleSlug=${articleId}`) // ✅ articleSlug not articleId
    .then(res => res.json())
    .then(setComments);
}, [articleId]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
body: JSON.stringify({ articleSlug: articleId, content: newComment }),
    });

    const saved = await res.json();
    setComments([saved, ...comments]);
    setNewComment("");
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">💬 Comments</h3>

      {session && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment._id} className="border p-3 rounded">
            <p className="text-sm text-gray-700">{comment.content}</p>
            <div className="text-xs text-gray-500 mt-1">
              – {comment.user.name}, {new Date(comment.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

