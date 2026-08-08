import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    announcementId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['General', 'Alert', 'News'],
      default: 'General',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft',
    },
    publishDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    mediaPath: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
