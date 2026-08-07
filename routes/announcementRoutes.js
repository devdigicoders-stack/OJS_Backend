import express from 'express';
import { getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectAdmin, getAllAnnouncements);
router.post('/', protectAdmin, createAnnouncement);
router.put('/:id', protectAdmin, updateAnnouncement);
router.delete('/:id', protectAdmin, deleteAnnouncement);

export default router;
