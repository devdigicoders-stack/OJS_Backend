import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    journalId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    researchArea: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'English',
    },
    abstract: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    pages: {
      type: Number,
      required: true,
    },
    primaryAuthorName: {
      type: String,
      required: true,
    },
    primaryAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneCode: {
      type: String,
      default: '+91',
    },
    phone: {
      type: String,
      required: true,
    },
    coAuthors: {
      type: String,
      default: '',
    },
    isSameAuthor: {
      type: Boolean,
      default: true,
    },
    mainFilePath: {
      type: String,
      default: '',
    },
    originalFileName: {
      type: String,
      default: '',
    },
    additionalFilePaths: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Under Review', 'Reviewed', 'Processed', 'Approved', 'Rejected', 'Published'],
      default: 'Pending Review',
    },
    publishDate: {
      type: Date,
      default: null,
    },
    assignedReviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewerFeedback: {
      type: String,
      default: '',
    },
    doi: {
      type: String,
      default: '-',
    },
    volume: {
      type: String,
      default: '-',
    },
    issue: {
      type: String,
      default: '-',
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    citations: {
      type: Number,
      default: 0,
    },
    impactFactor: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;
