import express from 'express';
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getPublicAnnouncements, getPublicAnnouncementById } from '../controllers/announcementController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadAnnouncementMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/public', getPublicAnnouncements);
router.get('/public/:id', getPublicAnnouncementById);

router.get('/', protectAdmin, getAllAnnouncements);
router.post('/', protectAdmin, uploadAnnouncementMiddleware.single('media'), createAnnouncement);
router.put('/:id', protectAdmin, uploadAnnouncementMiddleware.single('media'), updateAnnouncement);
router.delete('/:id', protectAdmin, deleteAnnouncement);

export default router;
