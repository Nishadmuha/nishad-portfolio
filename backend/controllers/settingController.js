import Setting from '../models/Setting.js';
import Project from '../models/Project.js';

export const getPortfolio = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = {};
    }
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.json({
      settings,
      projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error loading portfolio' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updated = await Setting.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ message: 'Settings updated successfully', settings: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};
