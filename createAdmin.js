import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js'; // Using the new Admin model

dotenv.config(); // Load environment variables from .env

const createAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully.");

    // 2. Check if admin already exists
    const adminEmail = 'admin@ojs.com';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists!`);
      // Update the password if it exists just in case
      existingAdmin.password = '123456';
      await existingAdmin.save();
      console.log(`Updated existing admin password to 123456`);
      process.exit(0);
    }
    const adminToSave = new Admin({
      name: 'Super Admin',
      email: adminEmail,
      password: '123456', // Pass the raw password, the pre-save hook will hash it!
      role: 'Admin',
      status: 'Active',
      department: 'System Administration',
      avatarColor: 'green'
    });

    await adminToSave.save();
    
    console.log("-----------------------------------------");
    console.log("Admin User Created Successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: 123456`);
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
