import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function testCreate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user1 = await User.create({
      name: 'Test Create 1',
      email: 'testcreate1@example.com',
      password: 'password123',
      role: 'Author',
      status: 'Active'
    });
    console.log('Success 1:', user1.email);
    
    const user2 = await User.create({
      name: 'Test Create 2',
      email: 'testcreate2@example.com',
      password: 'password123',
      role: 'Author',
      status: 'Active'
    });
    console.log('Success 2:', user2.email);
    
    await User.deleteMany({ email: { $in: ['testcreate1@example.com', 'testcreate2@example.com'] } });
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
}

testCreate();
