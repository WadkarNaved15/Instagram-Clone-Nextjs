// @/lib/mongodb.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'Instagram-clone'; // Replace with your database name

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
