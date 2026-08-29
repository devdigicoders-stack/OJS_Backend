import express from 'express';
import { getSettings, getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/', protectAdmin, getSettings);
router.put('/', protectAdmin, updateSettings);

export default router;
