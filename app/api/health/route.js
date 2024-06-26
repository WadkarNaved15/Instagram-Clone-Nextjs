// pages/api/health.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

async function handler(req, res) {
  try {
    // Check if MongoDB client is initialized
    if (!clientPromise) {
      return NextResponse.json({ message: 'MongoDB client not initialized' }, { status: 500 });
    }

    const client = await clientPromise;

    // Manually check if client is connected or connecting
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

export {handler as GET};
