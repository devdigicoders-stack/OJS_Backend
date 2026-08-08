import mongoose from 'mongoose';

const HomePageSchema = new mongoose.Schema({
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, default: 'FaCheckCircle' }
  }],
  domains: [{
    name: { type: String, required: true },
    icon: { type: String, default: 'FaCheckCircle' }
  }],
  reviews: [{
    author: { type: String, required: true },
    role: { type: String, default: 'Author' },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

const HomePage = mongoose.models.HomePage || mongoose.model('HomePage', HomePageSchema);
export default HomePage;
