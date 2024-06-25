import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const { postId, userId } = await req.json();

  if (!postId || !userId) {
    return NextResponse.json({ message: 'Missing postId or userId' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('Instagram-clone'); // Replace with your database name
  const collection = db.collection('Posts'); // Replace with your collection name

  try {
    const post = await collection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      await collection.updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { likes: userId } }
      );
    } else {
      await collection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: userId } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ message: 'Error updating likes' }, { status: 500 });
  }
}
