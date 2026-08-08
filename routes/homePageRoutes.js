import express from 'express';
import { getHomePage, updateHomePage, uploadReviewImage } from '../controllers/homePageController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get Home page data
router.get('/public', getHomePage);

// Admin routes
router.get('/', protectAdmin, getHomePage);
router.put('/', protectAdmin, updateHomePage);
router.post('/upload-image', protectAdmin, uploadAvatarMiddleware.single('image'), uploadReviewImage);

export default router;
