import JournalPage from '../models/JournalPage.js';

// GET all pages (Admin)
export const getAllPages = async (req, res) => {
  try {
    const pages = await JournalPage.find().sort({ updatedAt: -1 }).select('-content'); // Exclude heavy content for list view
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages', error: error.message });
  }
};

// GET single page by ID (Admin)
export const getPageById = async (req, res) => {
  try {
    const page = await JournalPage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page', error: error.message });
  }
};

// GET single page by Slug (Admin)
export const getPageBySlugAdmin = async (req, res) => {
  try {
    const page = await JournalPage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page', error: error.message });
  }
};

// GET single page by Slug (Public Website)
export const getPageBySlug = async (req, res) => {
  try {
    const page = await JournalPage.findOne({ slug: req.params.slug, status: 'published' });
    if (!page) return res.status(404).json({ message: 'Page not found or is not published' });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page', error: error.message });
  }
};

// CREATE new page (Admin)
export const createPage = async (req, res) => {
  try {
    const { title, slug, shortDescription, content, status, seoTitle, seoDescription, seoKeywords } = req.body;
    
    // Check slug uniqueness
    const existing = await JournalPage.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Slug already exists. Must be unique.' });

    const newPage = await JournalPage.create({
      title, slug, shortDescription, content, status, seoTitle, seoDescription, seoKeywords
    });
    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating page', error: error.message });
  }
};

// UPDATE page (Admin)
export const updatePage = async (req, res) => {
  try {
    const { title, slug, shortDescription, content, status, seoTitle, seoDescription, seoKeywords } = req.body;
    
    // Check slug uniqueness for other pages
    const existing = await JournalPage.findOne({ slug, _id: { $ne: req.body._id } });
    if (existing) return res.status(400).json({ message: 'Slug already exists. Must be unique.' });

    const updatedPage = await JournalPage.findOneAndUpdate(
      { slug: req.params.slug },
      { title, slug, shortDescription, content, status, seoTitle, seoDescription, seoKeywords },
      { new: true, runValidators: true }
    );
    
    if (!updatedPage) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page', error: error.message });
  }
};

// PATCH toggle status (Admin)
export const togglePageStatus = async (req, res) => {
  try {
    const page = await JournalPage.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    
    page.status = page.status === 'published' ? 'draft' : 'published';
    await page.save();
    
    res.status(200).json({ message: `Page is now ${page.status}`, status: page.status });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling status', error: error.message });
  }
};

// DELETE page (Admin)
export const deletePage = async (req, res) => {
  try {
    const page = await JournalPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page', error: error.message });
  }
};
