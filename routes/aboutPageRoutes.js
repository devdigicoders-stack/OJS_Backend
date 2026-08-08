import express from 'express';
import { getAboutPage, updateAboutPage, uploadTeamImage } from '../controllers/aboutPageController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get About page
router.get('/public', getAboutPage);

// Admin routes
router.get('/', protectAdmin, getAboutPage);
router.put('/', protectAdmin, updateAboutPage);
router.post('/upload-image', protectAdmin, uploadAvatarMiddleware.single('image'), uploadTeamImage);

export default router;
