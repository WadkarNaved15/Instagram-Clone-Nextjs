import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the client is not recreated on every hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client on each connect call
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

if (process.env.NODE_ENV === 'development') {
  // Enable logging, debugging features, etc.
  console.log('Running in development mode');
} else if (process.env.NODE_ENV === 'production') {
  // Optimize for production: minification, caching, etc.
  console.log('Running in production mode');
}


export default clientPromise;
