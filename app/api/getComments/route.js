import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'postId is required' }, { status: 400 });
    }

    const { client, db } = await connectToDatabase();
    const collection = db.collection('Comments'); 

    // Find comments for the given postId
    const comments = await collection.find({ postId: postId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}


