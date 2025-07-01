import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";
export const dynamic = 'force-dynamic';
export async function GET() {
  await connectDB();
  const articles = await Article.find().select("slug").lean();

  const baseUrl = "https://trendwise.vercel.app"; 

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${articles
    .map(
      (article) => `
    <url>
      <loc>${baseUrl}/article/${article.slug}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
