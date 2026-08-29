import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Praxis Journal of Society, Behaviour and Institutional Studies' },
    supportEmail: { type: String, default: 'support@ojs.com' },
    issn: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' },
    allowRegistrations: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
