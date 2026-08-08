import HomePage from '../models/HomePage.js';

// GET the Home Page data
export const getHomePage = async (req, res) => {
  try {
    let page = await HomePage.findOne();
    if (!page) {
      // If it doesn't exist, create a blank one with defaults
      page = await HomePage.create({
        stats: [],
        domains: [],
        reviews: []
      });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Home page data', error: error.message });
  }
};

// PUT/Update the Home Page data
export const updateHomePage = async (req, res) => {
  try {
    const data = req.body;
    let page = await HomePage.findOne();
    
    if (!page) {
      page = await HomePage.create(data);
    } else {
      page = await HomePage.findByIdAndUpdate(page._id, data, { new: true, runValidators: true });
    }
    
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Home page data', error: error.message });
  }
};

// Upload an image for a customer review
export const uploadReviewImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const imageUrl = `/uploads/avatars/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};
