import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  return uri;
}

export async function connectDB() {
  const state = mongoose.connection.readyState;

  if (state === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  if (state === 2 && cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  cached.conn = null;
  cached.promise = null;

  const uri = getMongoUri();

  cached.promise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then((m) => {
      cached.conn = m;
      return m;
    })
    .catch((error) => {
      cached.promise = null;
      cached.conn = null;
      throw error;
    });

  cached.conn = await cached.promise;
  return cached.conn;
}
