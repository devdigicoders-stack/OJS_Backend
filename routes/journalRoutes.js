import express from 'express';
import {
  getAllJournals,
  getJournalById,
  updateJournalStatus,
  bulkUpdateJournalStatus,
  assignReviewer,
  publishJournal,
  uploadJournal,
  getMySubmissions,
  getMyStats,
  getPublicJournals,
  getPublicJournalById
} from '../controllers/journalController.js';
import { protectAdmin, protectUser } from '../middleware/authMiddleware.js';
import { uploadManuscriptMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes for website
router.get('/public', getPublicJournals);
router.get('/public/:id', getPublicJournalById);

// Author routes (using protectUser)
router.post('/upload', protectUser, uploadManuscriptMiddleware.fields([{ name: 'mainFile', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: 'additionalFiles', maxCount: 5 }]), uploadJournal);
router.get('/my-submissions', protectUser, getMySubmissions);
router.get('/my-stats', protectUser, getMyStats);

// Admin / Reviewer routes (using protectAdmin)
router.get('/', protectAdmin, getAllJournals);
router.put('/bulk-status', protectAdmin, bulkUpdateJournalStatus);
router.get('/:id', protectAdmin, getJournalById);
router.put('/:id/status', protectAdmin, updateJournalStatus);
router.put('/:id/assign', protectAdmin, assignReviewer);
router.put('/:id/publish', protectAdmin, publishJournal);

export default router;
