import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Admin',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    department: {
      type: String,
      default: 'System Administration',
    },
    phone: {
      type: String,
      default: '',
    },
    initials: {
      type: String,
    },
    avatarColor: {
      type: String,
      default: 'green',
    },
  },
  { timestamps: true }
);

// Method to compare entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password and generate initials
adminSchema.pre('save', async function (next) {
  if (this.name && !this.initials) {
    this.initials = this.name.substring(0, 2).toUpperCase();
  }

  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
