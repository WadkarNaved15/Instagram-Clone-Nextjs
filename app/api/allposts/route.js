// pages/api/posts.js
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';


async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Posts'); // Replace with your collection name
    const posts = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export {handler as GET};
