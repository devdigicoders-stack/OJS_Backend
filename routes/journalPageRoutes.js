import express from 'express';
import { 
  getAllPages, 
  getPageById, 
  getPageBySlug, 
  createPage, 
  updatePage, 
  deletePage, 
  togglePageStatus,
  getPageBySlugAdmin
} from '../controllers/journalPageController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for website
router.get('/public/:slug', getPageBySlug);

// Admin routes
router.get('/', protectAdmin, getAllPages);
router.get('/:id', protectAdmin, getPageById);
router.get('/admin/:slug', protectAdmin, getPageBySlugAdmin);
router.post('/', protectAdmin, createPage);
router.put('/:slug', protectAdmin, updatePage);
router.patch('/:id/status', protectAdmin, togglePageStatus);
router.delete('/:id', protectAdmin, deletePage);

export default router;
