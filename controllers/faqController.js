import Faq from '../models/Faq.js';

// Get all FAQs (Admin)
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};

// Get public active FAQs (Website)
export const getPublicFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public FAQs', error: error.message });
  }
};

// Create a new FAQ (Admin)
export const createFaq = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;
    const faq = await Faq.create({ question, answer, isActive });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ', error: error.message });
  }
};

// Update an FAQ (Admin)
export const updateFaq = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, isActive },
      { new: true, runValidators: true }
    );
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ', error: error.message });
  }
};

// Toggle FAQ Active Status (Admin)
export const toggleFaqStatus = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    
    faq.isActive = !faq.isActive;
    await faq.save();
    
    res.status(200).json({ message: `FAQ is now ${faq.isActive ? 'Active' : 'Deactive'}`, isActive: faq.isActive });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling FAQ status', error: error.message });
  }
};

// Delete an FAQ (Admin)
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ', error: error.message });
  }
};
