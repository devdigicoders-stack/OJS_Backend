import express from 'express';
import { getDashboardStats, getStatusChartData, getRecentSubmissions, getSubmissionsChartData } from '../controllers/dashboardController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protectAdmin, getDashboardStats);
router.get('/status-chart', protectAdmin, getStatusChartData);
router.get('/recent-submissions', protectAdmin, getRecentSubmissions);
router.get('/submissions-chart', protectAdmin, getSubmissionsChartData);

export default router;
