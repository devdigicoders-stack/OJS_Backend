import mongoose from 'mongoose';

const HomePageSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Journal of society, behaviour and institutions' },
    subtitle: { type: String, default: 'A premium academic publishing platform dedicated to sharing high-impact knowledge globally through rigorous peer review.' },
    badge: { type: String, default: 'Empowering Global Scientific Research' },
    primaryButtonText: { type: String, default: 'Submit Manuscript' },
    primaryButtonLink: { type: String, default: '/journals' },
    secondaryButtonText: { type: String, default: 'Explore Publications' },
    secondaryButtonLink: { type: String, default: '/journals' },
    backgroundType: { type: String, enum: ['video', 'image'], default: 'video' },
    backgroundUrl: { type: String, default: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_3840_2160_25fps.mp4' },
    overlayOpacity: { type: String, default: '70' }
  },
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
