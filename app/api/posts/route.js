
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error('User session or email not found');
    }
    const data = await req.json()
    const profileId = data.profileId 
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Posts');

    const posts = await collection.find({ profileId }).sort({ uploadedAt: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export { handler as POST };
