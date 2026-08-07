import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { siteName, supportEmail, allowRegistrations, maintenanceMode } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({ siteName, supportEmail, allowRegistrations, maintenanceMode });
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { siteName, supportEmail, allowRegistrations, maintenanceMode },
        { new: true, runValidators: true }
      );
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};
