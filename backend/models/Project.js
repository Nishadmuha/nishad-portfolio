import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
