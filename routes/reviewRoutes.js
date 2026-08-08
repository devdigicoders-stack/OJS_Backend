import express from 'express';
import { submitReview, getApprovedReviews, getAllReviews, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/submit', submitReview);
router.get('/approved', getApprovedReviews);

// Admin routes
router.get('/', protectAdmin, getAllReviews);
router.patch('/:id/status', protectAdmin, updateReviewStatus);
router.delete('/:id', protectAdmin, deleteReview);

export default router;
