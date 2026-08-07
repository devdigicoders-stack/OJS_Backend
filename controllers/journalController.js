import Journal from '../models/Journal.js';
import User from '../models/User.js';

// Get all journals (Admin)
export const getAllJournals = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { journalId: { $regex: search, $options: 'i' } }
      ];
    }

    const journals = await Journal.find(query)
      .populate('primaryAuthorId', 'name email')
      .populate('assignedReviewer', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journals', error: error.message });
  }
};

// Get single journal details
export const getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id)
      .populate('primaryAuthorId', 'name email department')
      .populate('assignedReviewer', 'name email');
      
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journal details', error: error.message });
  }
};

// Update Journal Status
export const updateJournalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const journal = await Journal.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: false }
    );
    
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Bulk Update Journal Status
export const bulkUpdateJournalStatus = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting { updates: [{ id: '...', status: '...' }] }
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty updates array' });
    }

    const updatePromises = updates.map(update => 
      Journal.findByIdAndUpdate(update.id, { status: update.status }, { new: true })
    );

    const results = await Promise.all(updatePromises);
    res.status(200).json({ message: 'Bulk update successful', count: results.length, results });
  } catch (error) {
    res.status(500).json({ message: 'Error in bulk update', error: error.message });
  }
};

// Assign Reviewer
export const assignReviewer = async (req, res) => {
  try {
    const { reviewerId } = req.body;
    
    // Verify reviewer exists and has reviewer role
    const reviewer = await User.findById(reviewerId);
    if (!reviewer || reviewer.role !== 'Reviewer') {
      return res.status(400).json({ message: 'Invalid reviewer selected' });
    }

    const journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { assignedReviewer: reviewerId, status: 'Under Review' },
      { new: true }
    );

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning reviewer', error: error.message });
  }
};

// Publish Journal
export const publishJournal = async (req, res) => {
  try {
    const { doi, publishDate, volume, issue } = req.body;
    
    const journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Published',
        doi,
        publishDate: publishDate || new Date(),
        volume,
        issue
      },
      { new: true }
    );

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error publishing journal', error: error.message });
  }
};

// Author - Submit Journal
export const uploadJournal = async (req, res) => {
  try {
    const { 
      title, abstract, department, researchArea, keywords, 
      pages, primaryAuthorName, email, phone, phoneCode, coAuthors, isSameAuthor
    } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Manuscript file (mainFile) is required' });
    }

    // Auto-generate Journal ID (simple logic for now)
    const count = await Journal.countDocuments();
    const currentYear = new Date().getFullYear();
    const journalId = `J-${currentYear}-${(count + 1).toString().padStart(3, '0')}`;

    const parsedKeywords = typeof keywords === 'string' ? JSON.parse(keywords) : keywords;
    const parsedIsSameAuthor = typeof isSameAuthor === 'string' ? isSameAuthor === 'true' : isSameAuthor;

    const journal = await Journal.create({
      journalId,
      title,
      abstract,
      department,
      researchArea,
      keywords: parsedKeywords,
      pages,
      primaryAuthorName,
      email,
      phone,
      phoneCode,
      coAuthors,
      isSameAuthor: parsedIsSameAuthor,
      primaryAuthorId: req.user._id,
      mainFilePath: req.file.path, // Use actual file path from Multer
      originalFileName: req.file.originalname,
      status: 'Pending Review'
    });

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting journal', error: error.message });
  }
};

// Author - Get My Submissions
export const getMySubmissions = async (req, res) => {
  try {
    const authorId = req.user._id; 
    
    if (!authorId) return res.status(400).json({ message: 'Author ID is required' });

    const journals = await Journal.find({ primaryAuthorId: authorId }).sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

// Author - Get My Stats
export const getMyStats = async (req, res) => {
  try {
    const authorId = req.user._id; 
    
    if (!authorId) return res.status(400).json({ message: 'Author ID is required' });

    const journals = await Journal.find({ primaryAuthorId: authorId });
    
    const stats = {
      total: journals.length,
      processing: journals.filter(j => j.status === 'Processing').length,
      underReview: journals.filter(j => j.status === 'Under Review').length,
      published: journals.filter(j => j.status === 'Published').length,
      rejected: journals.filter(j => j.status === 'Rejected').length,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

