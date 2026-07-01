import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String, default: '' },
  socials: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  bannerImage: { type: String, default: '' },
  aboutImage: { type: String, default: '' },
  philosophyQuote: { type: String, default: '' },
  whyChooseMe: [{
    title: { type: String },
    description: { type: String }
  }],
  experience: [{
    role: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String }
  }],
  achievements: [{
    title: { type: String },
    subtitle: { type: String },
    year: { type: String },
    description: { type: String }
  }],
  hobbies: [{
    image: { type: String },
    caption: { type: String }
  }],
  services: [{
    title: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    image: { type: String }
  }],
  faqs: [{
    q: { type: String },
    a: { type: String }
  }]
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
