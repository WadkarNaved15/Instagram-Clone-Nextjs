
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { uploadImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { deleteImage } from '@/lib/cloudinary';
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
    try{
        const image = await uploadImage(file);
        const { client, db } = await connectToDatabase();
        const collection = db.collection('Posts'); 
    
        const uploadData = {
            username : session.user.name,
            profileId : session.user.email.split('@')[0],
            profileImg : session.user.image,
            imageUrl : image?.secure_url,
            public_id : image?.public_id,
            caption: caption || '',
            likes : [],
            uploadedAt: new Date(),
        };
        const result = await collection.insertOne(uploadData);
        return NextResponse.json({message: "image uploaded successfully", result}, { status: 200 });
    }catch(error){
        console.log(error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    }

export async function DELETE(req, res) {
  try {
    const { id , public_id} = await req.json(); 
    const { client, db } = await connectToDatabase();
    const postCollection = db.collection('Posts'); 
    const commentCollection = db.collection('Comments');

    const dimage = await deleteImage(public_id);
    
    const postresult = await postCollection.deleteOne({ _id:new ObjectId(id) });
    if (postresult.deletedCount !== 1) {
        
      return NextResponse.json({ success: false, message: 'Post not found in database' }, { status: 404 });
      
    }
    const commentresult = await commentCollection.deleteMany({ postId: id });


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post and file:', error);
    return NextResponse.json({ success: false, message: 'Error deleting post and file' }, { status: 500 });
  }
}
