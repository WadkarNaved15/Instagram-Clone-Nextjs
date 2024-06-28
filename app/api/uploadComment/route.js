import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';


export async function POST(req, res) {
  try {
    const data = await req.json();
    const { postId, userId, comment, userImg } = data;

    if (!postId || !userId || !comment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Connect to the MongoDB client
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Comments'); 

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

export async function DELETE(req, res) {
  try {
    const data = await req.json();
    const id = data.id;
    console.log(id)
    const { client, db } = await connectToDatabase();
    const Collection = db.collection('Comments');
    const result = await Collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount !== 1) {
      return NextResponse.json({ success: false, message: 'Comment not found in database' }, { status: 404 });   
    }
  } catch (error) {
    console.error('Error deleting post and file:', error);
    return NextResponse.json({ success: false, message: 'Error deleting comment' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}