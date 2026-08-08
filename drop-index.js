import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Drop the problematic index
    await User.collection.dropIndex('phone_1');
    console.log('Dropped phone_1 index successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error dropping index:', error.message);
    
    // Check if it's because the index doesn't exist
    if (error.code === 27) {
        console.log('Index not found, perhaps already dropped.');
    }
    
    process.exit(1);
  }
}

dropIndex();
