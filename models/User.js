import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Author', 'Reviewer', 'Editor'],
      default: 'Author',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    department: {
      type: String,
      default: '',
    },
    institution: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    title: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    bio: { type: String, default: '' },
    
    orcid: { type: String, default: '' },
    researcherId: { type: String, default: '' },
    scopusId: { type: String, default: '' },
    googleScholar: { type: String, default: '' },
    
    specializations: { type: [String], default: [] },
    
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    researchGate: { type: String, default: '' },
    
    initials: {
      type: String,
    },
    avatarColor: {
      type: String,
      default: 'blue',
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Add a compound unique index so a user can have different roles with the same email,
// but cannot have the SAME role with the same email multiple times.
userSchema.index({ email: 1, role: 1 }, { unique: true });

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password and generate initials
userSchema.pre('save', async function () {
  if (this.name && !this.initials) {
    this.initials = this.name.substring(0, 2).toUpperCase();
  }

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
