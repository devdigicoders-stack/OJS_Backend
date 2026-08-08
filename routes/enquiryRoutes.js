import express from 'express';
import { getAllEnquiries, createEnquiry, updateEnquiryStatus, deleteEnquiry } from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for website
router.post('/public', createEnquiry);

// Admin routes
router.get('/', protectAdmin, getAllEnquiries);
router.patch('/:id/status', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

export default router;
