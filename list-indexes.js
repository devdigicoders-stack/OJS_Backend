import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function listIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const indexes = await User.collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listIndexes();
