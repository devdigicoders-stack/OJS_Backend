import mongoose from 'mongoose';

const AboutPageSchema = new mongoose.Schema({
  introduction: { type: String, default: '' },
  introductionText: { type: String, default: '' }, // For standard non-rich text (optional)
  mission: [{ type: String }],
  vision: [{ type: String }],
  objectives: [{ type: String }],
  features: [{
    title: { type: String, required: true },
    icon: { type: String, default: 'FaCheckCircle' }
  }],
  researchAreas: [{
    name: { type: String, required: true },
    icon: { type: String, default: 'FaCheckCircle' }
  }],
  team: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    img: { type: String, default: '' }
  }],
  processSteps: [{ type: String }],
  stats: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  editorInChief: {
    name: { type: String, default: 'Prof. John Doe' },
    affiliation: { type: String, default: 'Department of Computer Science, University of Technology' },
    email: { type: String, default: 'editor@example.com' }
  }
}, {
  timestamps: true
});

const AboutPage = mongoose.models.AboutPage || mongoose.model('AboutPage', AboutPageSchema);
export default AboutPage;
