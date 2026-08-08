import express from 'express';
import { getAllFaqs, getPublicFaqs, createFaq, updateFaq, deleteFaq, toggleFaqStatus } from '../controllers/faqController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for website
router.get('/public', getPublicFaqs);

// Admin routes
router.get('/', protectAdmin, getAllFaqs);
router.post('/', protectAdmin, createFaq);
router.put('/:id', protectAdmin, updateFaq);
router.patch('/:id/toggle-status', protectAdmin, toggleFaqStatus);
router.delete('/:id', protectAdmin, deleteFaq);

export default router;
