import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '7d',
  });
};

// Admin login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });
    
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (admin.status !== 'Active') {
      return res.status(403).json({ message: 'Admin account is inactive' });
    }

    res.status(200).json({ 
      message: 'Login successful',
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatarColor: admin.avatarColor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get profile (Protected)
export const getProfile = async (req, res) => {
  try {
    // req.admin is set by the protectAdmin middleware
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update profile (Protected)
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, department } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { name, phone, department },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Change password (Protected)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new passwords' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// ==========================================
// REGULAR USER (Author, Reviewer, Editor) APIs
// ==========================================
import User from '../models/User.js';

// User Register
export const userRegister = async (req, res) => {
  try {
    const { name, fullName, email, password, role, phone, institution, department, designation } = req.body;
    
    // Support both 'name' and 'fullName' from frontend
    const finalName = fullName || name;
    if (!finalName) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Only allow specific roles to register themselves. Default to Author if not provided.
    const finalRole = role || 'Author';
    const allowedRoles = ['Author', 'Reviewer', 'Editor'];
    if (!allowedRoles.includes(finalRole)) {
      return res.status(400).json({ message: 'Invalid role for user registration' });
    }

    const userExists = await User.findOne({ email, role: finalRole });
    if (userExists) {
      return res.status(400).json({ message: `User already exists as ${finalRole}` });
    }

    const user = await User.create({
      name: finalName,
      email,
      password,
      role: finalRole,
      phone,
      institution,
      department,
      designation
    });

    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' });
    }

    const user = await User.findOne({ email, role });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email, password, or role' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'User account is inactive. Please contact admin.' });
    }

    res.status(200).json({ 
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during user login', error: error.message });
  }
};

// Get User Profile (Protected)
export const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the protectUser middleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Combine firstName and lastName back to name if provided, else keep as is or update name directly
    let updatedName = user.name;
    if (req.body.firstName || req.body.lastName) {
      updatedName = `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim();
    } else if (req.body.name) {
      updatedName = req.body.name;
    }

    user.name = updatedName || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.institution = req.body.institution !== undefined ? req.body.institution : user.institution;
    user.department = req.body.department !== undefined ? req.body.department : user.department;
    user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
    user.title = req.body.title !== undefined ? req.body.title : user.title;
    user.dob = req.body.dob !== undefined ? req.body.dob : user.dob;
    user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
    user.city = req.body.city !== undefined ? req.body.city : user.city;
    user.country = req.body.country !== undefined ? req.body.country : user.country;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.orcid = req.body.orcid !== undefined ? req.body.orcid : user.orcid;
    user.researcherId = req.body.researcherId !== undefined ? req.body.researcherId : user.researcherId;
    user.scopusId = req.body.scopusId !== undefined ? req.body.scopusId : user.scopusId;
    user.googleScholar = req.body.googleScholar !== undefined ? req.body.googleScholar : user.googleScholar;
    user.specializations = req.body.specializations !== undefined ? req.body.specializations : user.specializations;
    user.website = req.body.website !== undefined ? req.body.website : user.website;
    user.twitter = req.body.twitter !== undefined ? req.body.twitter : user.twitter;
    user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
    user.researchGate = req.body.researchGate !== undefined ? req.body.researchGate : user.researchGate;
    
    // Regenerate initials if name changed
    if (user.isModified('name')) {
      user.initials = user.name.substring(0, 2).toUpperCase();
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

// Upload Avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Assuming static files are served at /uploads
    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    user.profilePic = fileUrl;
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Avatar uploaded successfully', 
      profilePic: fileUrl 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
};
