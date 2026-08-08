import AboutPage from '../models/AboutPage.js';

// GET the About Page data
export const getAboutPage = async (req, res) => {
  try {
    let page = await AboutPage.findOne();
    if (!page) {
      // If it doesn't exist, create a blank one with defaults
      page = await AboutPage.create({});
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching About page', error: error.message });
  }
};

// PUT/Update the About Page data
export const updateAboutPage = async (req, res) => {
  try {
    const data = req.body;
    let page = await AboutPage.findOne();
    
    if (!page) {
      page = await AboutPage.create(data);
    } else {
      page = await AboutPage.findByIdAndUpdate(page._id, data, { new: true, runValidators: true });
    }
    
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating About page', error: error.message });
  }
};

export const uploadTeamImage = async (req, res) => {
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
