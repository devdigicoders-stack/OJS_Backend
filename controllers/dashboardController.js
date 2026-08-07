import User from '../models/User.js';
import Journal from '../models/Journal.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJournals = await Journal.countDocuments();
    const pendingReviews = await Journal.countDocuments({ status: 'Pending Review' });
    const publishedJournals = await Journal.countDocuments({ status: 'Published' });
    
    res.status(200).json({
      totalUsers,
      totalJournals,
      pendingReviews,
      publishedJournals
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
