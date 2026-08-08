import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true },
  role: { type: String, default: 'Author', trim: true },
  text: { type: String, required: true, trim: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, {
  timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;
