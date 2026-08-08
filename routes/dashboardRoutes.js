import express from 'express';
import { getDashboardStats, getStatusChartData, getRecentSubmissions, getSubmissionsChartData, getPublicStats } from '../controllers/dashboardController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for website
router.get('/public-stats', getPublicStats);

router.get('/stats', protectAdmin, getDashboardStats);
router.get('/status-chart', protectAdmin, getStatusChartData);
router.get('/recent-submissions', protectAdmin, getRecentSubmissions);
router.get('/submissions-chart', protectAdmin, getSubmissionsChartData);

export default router;
