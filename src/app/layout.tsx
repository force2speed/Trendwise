import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrendWise",
  description: "Trending AI-powered blog platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          {/* 🔗 Navigation Bar */}
          <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/">TrendWise</Link>
            </h1>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/create" className="hover:underline">Create</Link>
              <Link href="/article" className="hover:underline">Articles</Link>
            </div>
          </nav>

          {/* 🧾 Main content */}
          <main className="p-6">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
