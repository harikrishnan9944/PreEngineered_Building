import mongoose from 'mongoose';
import { seedDatabase } from './db-seed';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout
      connectTimeoutMS: 15000,         // 15 seconds timeout
    };


    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongooseInstance) => {
      // Trigger database seeding in the background
      seedDatabase().catch((err) => {
        console.error('[Seeder] Background seeding error:', err);
      });
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
