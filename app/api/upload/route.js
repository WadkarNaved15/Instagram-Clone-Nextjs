
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

export async function POST(req, res) {
    const session = await getServerSession();
    const data = await req.formData();
    const file = data.get('file');
    const caption = data.get('caption');
    const imageUrl = data.get('imageUrl');

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `public/uploads/${Date.now()}${file.name}`;
    await fs.promises.writeFile(path, buffer);
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Posts'); 
   
    const uploadData = {
        username : session.user.name,
        profileId : session.user.email.split('@')[0],
        profileImg : session.user.image,
        caption: caption || '',
        imageUrl: path,
        likes : [],
        uploadedAt: new Date(),
    };
    const result = await collection.insertOne(uploadData);
    return NextResponse.json({succes:true});
    }

export async function DELETE(req, res) {
  try {
    const { id , imageUrl} = await req.json(); // Assuming id is sent in the request body
    const { client, db } = await connectToDatabase();
    const collection = db.collection('Posts'); // Replace with your collection name
    console.log(id,imageUrl)
    // Step 1: Delete document from MongoDB
    const result = await collection.deleteOne({ _id:new ObjectId(id) });

    if (result.deletedCount !== 1) {
        
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
      
    }

    // const filePath = imageUrl
    // await fs.unlink(filePath);

    // Step 3: Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post and file:', error);
    return NextResponse.json({ success: false, message: 'Error deleting post and file' }, { status: 500 });
  }
}
