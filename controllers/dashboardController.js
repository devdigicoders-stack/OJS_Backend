import User from '../models/User.js';
import Journal from '../models/Journal.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJournals = await Journal.countDocuments();
    const pendingReviews = await Journal.countDocuments({ status: 'Pending Review' });
    const publishedJournals = await Journal.countDocuments({ status: 'Published' });
    
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfThisMonth } });
    const usersLastMonth = await User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });
    
    const journalsThisMonth = await Journal.countDocuments({ createdAt: { $gte: startOfThisMonth } });
    const journalsLastMonth = await Journal.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });

    const pendingThisMonth = await Journal.countDocuments({ status: 'Pending Review', createdAt: { $gte: startOfThisMonth } });
    const pendingLastMonth = await Journal.countDocuments({ status: 'Pending Review', createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });

    const publishedThisMonth = await Journal.countDocuments({ status: 'Published', createdAt: { $gte: startOfThisMonth } });
    const publishedLastMonth = await Journal.countDocuments({ status: 'Published', createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } });

    const calculatePercentage = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    res.status(200).json({
      totalUsers,
      totalJournals,
      pendingReviews,
      publishedJournals,
      trends: {
        users: calculatePercentage(usersThisMonth, usersLastMonth),
        journals: calculatePercentage(journalsThisMonth, journalsLastMonth),
        pending: calculatePercentage(pendingThisMonth, pendingLastMonth),
        published: calculatePercentage(publishedThisMonth, publishedLastMonth)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get status chart data
export const getStatusChartData = async (req, res) => {
  try {
    const statuses = await Journal.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const dataStatus = statuses.map(s => ({
      name: s._id,
      value: s.count
    }));

    res.status(200).json(dataStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chart data', error: error.message });
  }
};

// Get recent submissions
export const getRecentSubmissions = async (req, res) => {
  try {
    const recentJournals = await Journal.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('primaryAuthorId', 'name email');

    res.status(200).json(recentJournals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent submissions', error: error.message });
  }
};

// Get submissions chart data (Trend by month)
export const getSubmissionsChartData = async (req, res) => {
  try {
    // We will group journals by the month and year of their creation
    const submissions = await Journal.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format for frontend Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // We want last 6 months ideally, or just map the results
    const chartData = submissions.map(item => ({
      name: `${months[item._id.month - 1]} ${item._id.year}`,
      submissions: item.count
    }));

    // If database is empty, return dummy data structure with 0 submissions
    if (chartData.length === 0) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      chartData.push({
        name: `${months[currentMonth]} ${currentYear}`,
        submissions: 0
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions chart data', error: error.message });
  }
};

// Get public stats for website
export const getPublicStats = async (req, res) => {
  try {
    const totalJournals = await Journal.countDocuments({ status: 'Published' });
    const totalAuthors = await User.countDocuments({ role: 'Author' });
    
    // Using distinct to get unique departments that actually have published journals
    const departmentsList = await Journal.distinct('department', { status: 'Published' });
    const totalDepartments = departmentsList.length;

    const stats = {
      totalJournals,
      totalAuthors,
      totalDepartments,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public stats', error: error.message });
  }
};
