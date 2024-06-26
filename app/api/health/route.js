// pages/api/health.js

import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

async function handler(req, res) {
  try {
    const { client, db } = await connectToDatabase();

    // Check if MongoDB client and database are initialized
    if (!client || !db) {
      return NextResponse.json({ message: 'MongoDB connection not established' }, { status: 500 });
    }

    // Check if client is connected
    if (client && client.topology && client.topology.isConnected()) {
      return NextResponse.json({ message: 'Database connection established' });
    } else {
      return NextResponse.json({ message: 'Database connection not established' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error checking database connection:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export { handler as GET };
