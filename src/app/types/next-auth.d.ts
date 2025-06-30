// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authOptions } from "./authOptions"; // extracted for reuse

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
