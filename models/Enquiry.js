import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Responded'],
      default: 'New',
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
