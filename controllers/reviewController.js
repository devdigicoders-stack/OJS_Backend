import Review from '../models/Review.js';

// PUBLIC: Submit a review from the website
export const submitReview = async (req, res) => {
  try {
    const { author, role, email, text, rating } = req.body;
    if (!author || !text) {
      return res.status(400).json({ message: 'Name and review text are required.' });
    }
    const review = await Review.create({ author, role, email, text, rating: rating || 5, status: 'Pending' });
    res.status(201).json({ message: 'Review submitted successfully! It will appear after approval.', review });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// PUBLIC: Get approved reviews for home page
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// ADMIN: Get all reviews (with filter by status)
export const getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// ADMIN: Update review status (Approve / Reject)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review status', error: error.message });
  }
};

// ADMIN: Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
