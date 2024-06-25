import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the postId from query parameters
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'postId is required' }, { status: 400 });
    }

    // Connect to the MongoDB client
    const client = await clientPromise;
    const db = client.db('Instagram-clone'); // Replace with your database name
    const collection = db.collection('Comments'); // Replace with your collection name

    // Find comments for the given postId
    const comments = await collection.find({ postId: postId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
  }
}


