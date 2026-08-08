import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Journal of society, behaviour and institutions' },
    supportEmail: { type: String, default: 'support@ojs.com' },
    allowRegistrations: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
