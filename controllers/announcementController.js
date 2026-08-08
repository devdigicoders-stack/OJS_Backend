import Announcement from '../models/Announcement.js';
import mongoose from 'mongoose';

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, category, expiryDate, status } = req.body;
    
    const count = await Announcement.countDocuments();
    const announcementId = `ANN-${(count + 1).toString().padStart(3, '0')}`;

    const announcement = await Announcement.create({
      announcementId,
      title,
      category,
      expiryDate,
      mediaPath: req.file ? req.file.path.replace(/\\/g, '/') : '',
      status: status || 'Draft',
      publishDate: status === 'Published' ? new Date() : null
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { title, category, expiryDate, status } = req.body;
    const updateData = { title, category, expiryDate, status };
    
    if (req.file) {
      updateData.mediaPath = req.file.path.replace(/\\/g, '/');
    }
    
    if (status === 'Published') {
      updateData.publishDate = new Date();
    }
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
};

export const toggleAnnouncementStatus = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    
    // Toggle between Published and Draft
    announcement.status = announcement.status === 'Published' ? 'Draft' : 'Published';
    if (announcement.status === 'Published' && !announcement.publishDate) {
      announcement.publishDate = new Date();
    }
    await announcement.save();
    
    res.status(200).json({ message: `Announcement marked as ${announcement.status}`, status: announcement.status });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling announcement status', error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};

// Get public announcements
export const getPublicAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'Published' }).sort({ publishDate: -1, createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public announcements', error: error.message });
  }
};

export const getPublicAnnouncementById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid announcement ID format' });
    }
    const announcement = await Announcement.findOne({ _id: req.params.id, status: 'Published' });
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.status(200).json(announcement);
  } catch (error) {
    console.error('Error in getPublicAnnouncementById:', error);
    res.status(500).json({ message: 'Error fetching public announcement', error: error.message });
  }
};
