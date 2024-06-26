// pages/api/posts.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error('User session or email not found');
    }

    const profileId = session.user.email.split('@')[0];

    const client = await clientPromise;
    const db = client.db('Instagram-clone'); // Replace with your database name
    const collection = db.collection('Posts'); // Replace with your collection name

    const posts = await collection.find({ profileId }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export { handler as GET };
