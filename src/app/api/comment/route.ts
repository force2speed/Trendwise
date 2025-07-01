// src/app/api/comment/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const articleSlug = searchParams.get("articleSlug");

  if (!articleSlug) {
    return NextResponse.json({ error: "Missing articleSlug" }, { status: 400 });
  }

  const comments = await Comment.find({ articleSlug }).sort({ createdAt: -1 });
  return NextResponse.json(comments);
}

  export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { articleSlug, content } = body;

  if (!articleSlug || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newComment = await Comment.create({
    articleSlug,
    content,
    user: {
      name: session.user?.name,
      email: session.user?.email,
      image: session.user?.image,
    },
    createdAt: new Date(),
  });

  return NextResponse.json(newComment, { status: 201 });
}