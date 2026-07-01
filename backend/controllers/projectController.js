import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error loading projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, year, category, image } = req.body;
    if (!name || !year || !category) {
      return res.status(400).json({ message: 'Name, year, and category are required' });
    }
    
    const newProject = await Project.create({ name, year, category, image: image || '' });
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, category, image } = req.body;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (name !== undefined) project.name = name;
    if (year !== undefined) project.year = year;
    if (category !== undefined) project.category = category;
    if (image !== undefined) project.image = image;
    
    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
