import Enquiry from '../models/Enquiry.js';

// Get all enquiries (Admin)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enquiries', error: error.message });
  }
};

// Submit a new enquiry (Public)
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const enquiry = await Enquiry.create({ name, email, phone, subject, message });
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting enquiry', error: error.message });
  }
};

// Update enquiry status (Admin)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating enquiry status', error: error.message });
  }
};

// Delete an enquiry (Admin)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting enquiry', error: error.message });
  }
};
