// src/app/api/article/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";

export async function POST(req: Request) {
  try {
    let topic = "";

    const contentType = req.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const body = await req.json();
      topic = body.topic;
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      topic = form.get("topic") as string;
    }

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not set" },
        { status: 500 }
      );
    }

    await connectDB();

    // 🔥 Call OpenRouter (Mistral model)
    const openaiRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: `Generate an SEO-optimized blog article about: "${topic}".
Structure:
- Title (H1)
- Meta title & description
- Content in H2/H3 format
- List a few relevant image or video URLs or tweets
Return everything clearly labeled.`,
            },
          ],
        }),
      }
    );

    const data = await openaiRes.json();
    console.log("🧠 OpenAI Response:", data);

    if (!data.choices || !data.choices[0].message) {
      return NextResponse.json(
        { error: "Failed to generate article" },
        { status: 500 }
      );
    }

    const content = data.choices[0].message.content;

    // 🔍 Parse content
    // 🔍 Extract values from content
    const title = content.match(/Title \(H1\):\s*(.+)/)?.[1]?.trim() || topic;
    const metaTitle = content.match(/Meta Title:\s*(.+)/)?.[1]?.trim() || title;
    const metaDescription =
      content.match(/Meta Description:\s*(.+)/)?.[1]?.trim() || "";

    // ✂️ Remove everything before "Content:" to get clean article body
    const contentStartIndex = content.indexOf("Content:");
    const cleanedContent =
      contentStartIndex !== -1
        ? content.slice(contentStartIndex + "Content:".length).trim()
        : content;

    // 🔗 Get media links
    const media = [...cleanedContent.matchAll(/https?:\/\/\S+/g)].map(
      (m) => m[0]
    );

    // 🐍 Slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // 🧠 Save to DB
    const article = await Article.create({
      title,
      slug,
      meta: {
        title: metaTitle,
        description: metaDescription,
        ogImage: media[0] || "",
      },
      content: cleanedContent,
      media,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("❌ Error in /api/article POST:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
