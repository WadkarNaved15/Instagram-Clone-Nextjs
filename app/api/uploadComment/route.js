import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';


export async function POST(req, res) {
  try {
    // Parse the incoming data
    const data = await req.json();
    const { postId, userId, comment, userImg } = data;

    // Validate input data
    if (!postId || !userId || !comment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Connect to the MongoDB client
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Comments'); // Replace with your collection name

    // Create the comment object
    const newComment = {
      postId: postId,
      userId: userId,
      userImg: userImg,
      comment: comment,
      commentedAt: new Date(),
    };

    // Insert the comment into the database
    const result = await collection.insertOne(newComment);

    return NextResponse.json({ succes: true }, { status: 201 });
  } catch (error) {
    console.error('Error uploading comment:', error);
    return NextResponse.json({ message: 'Error uploading comment' }, { status: 500 });
  }
}

