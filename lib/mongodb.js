import { MongoClient } from 'mongodb';

// Replace '<username>' and '<password>' with your actual credentials
const uri = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const clientPromise = new MongoClient(uri, options)
  .connect()
  .then((client) => {
    console.log('MongoDB connected');
    return client;
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default clientPromise;
