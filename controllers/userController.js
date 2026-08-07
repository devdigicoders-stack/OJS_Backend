import User from '../models/User.js';

// Get all users with optional filtering
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get single user
export const getReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: 'Reviewer' }).sort({ createdAt: -1 });
    res.status(200).json(reviewers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviewers', error: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status, department } = req.body;
    
    // Check if user with same email AND same role exists
    const userExists = await User.findOne({ email, role });
    if (userExists) return res.status(400).json({ message: `User already exists as ${role}` });

    const user = await User.create({
      name,
      email,
      password, // Note: In production, password should be hashed!
      role,
      status,
      department
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};
