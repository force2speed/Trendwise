// src/lib/mongodb.ts

import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend NodeJS global type
declare global {
  var mongoose: MongooseGlobal;
}

// Reuse global object if available
const globalCache = globalThis as typeof globalThis & { mongoose?: MongooseGlobal };

const cached = globalCache.mongoose ?? {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "trendwise",
      bufferCommands: false,
    }).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  globalCache.mongoose = cached;

  return cached.conn;
}

export default connectDB;
