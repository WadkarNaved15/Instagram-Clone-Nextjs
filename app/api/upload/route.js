
import fs from 'fs';
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