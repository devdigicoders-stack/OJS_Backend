import Announcement from '../models/Announcement.js';

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

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};
