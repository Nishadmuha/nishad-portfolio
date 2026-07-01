import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolioData, setPortfolioData] = useState({ settings: {}, projects: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', error: false });
  const navigate = useNavigate();

  // Project Form States
  const [projId, setProjId] = useState('');
  const [projName, setProjName] = useState('');
  const [projYear, setProjYear] = useState('');
  const [projCategory, setProjCategory] = useState('design');
  const [projImage, setProjImage] = useState('');
  const [projUploading, setProjUploading] = useState(false);

  // Settings Form States
  const [settings, setSettings] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    resumeUrl: '',
    socials: { twitter: '', linkedin: '', instagram: '' },
    experience: [],
    achievements: [],
    bannerImage: '',
    aboutImage: '',
    hobbies: []
  });

  // Asset Uploader States
  const [rawUploadStatus, setRawUploadStatus] = useState('Ready to upload');
  const [uploadedUrl, setUploadedUrl] = useState('');

  // Contact Messages States
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    loadPortfolioData();
    loadMessages();
  }, []);

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, error: isError });
    setTimeout(() => {
      setToast({ show: false, message: '', error: false });
    }, 3500);
  };

  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/portfolio');
      setPortfolioData(res.data);
      if (res.data.settings) {
        setSettings({
          name: res.data.settings.name || '',
          title: res.data.settings.title || '',
          bio: res.data.settings.bio || '',
          email: res.data.settings.email || '',
          resumeUrl: res.data.settings.resumeUrl || '',
          socials: res.data.settings.socials || { twitter: '', linkedin: '', instagram: '' },
          experience: res.data.settings.experience || [],
          achievements: res.data.settings.achievements || [],
          bannerImage: res.data.settings.bannerImage || '',
          aboutImage: res.data.settings.aboutImage || '',
          hobbies: res.data.settings.hobbies || []
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load portfolio data.', true);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load messages.', true);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  // --- Project CRUD Operations ---
  const handleProjectImageUpload = async (file) => {
    setProjUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProjImage(res.data.fileUrl);
      showToast('Project image uploaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload project image.', true);
    } finally {
      setProjUploading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projName || !projYear) {
      showToast('Name and Year are required.', true);
      return;
    }

    const payload = { name: projName, year: projYear, category: projCategory, image: projImage };

    try {
      if (projId) {
        await api.put(`/projects/${projId}`, payload);
        showToast('Project updated successfully.');
      } else {
        await api.post('/projects', payload);
        showToast('Project created successfully.');
      }
      resetProjectForm();
      loadPortfolioData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save project.', true);
    }
  };

  const startEditProject = (project) => {
    setProjId(project._id);
    setProjName(project.name);
    setProjYear(project.year);
    setProjCategory(project.category);
    setProjImage(project.image || '');
    document.getElementById('project-form').scrollIntoView({ behavior: 'smooth' });
  };

  const resetProjectForm = () => {
    setProjId('');
    setProjName('');
    setProjYear('');
    setProjCategory('design');
    setProjImage('');
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      showToast('Project deleted successfully.');
      loadPortfolioData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete project.', true);
    }
  };

  // --- Settings Form Operations ---
  const handleAddExperience = () => {
    setSettings(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', description: '' }]
    }));
  };

  const handleRemoveExperience = (index) => {
    setSettings(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...settings.experience];
    updated[index][field] = value;
    setSettings(prev => ({ ...prev, experience: updated }));
  };

  const handleAddAchievement = () => {
    setSettings(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', subtitle: '', year: '', description: '' }]
    }));
  };

  const handleRemoveAchievement = (index) => {
    setSettings(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== index)
    }));
  };

  const handleAchievementChange = (index, field, value) => {
    const updated = [...settings.achievements];
    updated[index][field] = value;
    setSettings(prev => ({ ...prev, achievements: updated }));
  };

  const handleBannerImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings(prev => ({ ...prev, bannerImage: res.data.fileUrl }));
      showToast('Banner image uploaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload banner image.', true);
    }
  };

  const handleAboutImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings(prev => ({ ...prev, aboutImage: res.data.fileUrl }));
      showToast('About image uploaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload about image.', true);
    }
  };

  const handleAddHobby = () => {
    setSettings(prev => ({
      ...prev,
      hobbies: [...prev.hobbies, { image: '', caption: '' }]
    }));
  };

  const handleRemoveHobby = (index) => {
    setSettings(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, idx) => idx !== index)
    }));
  };

  const handleHobbyChange = (index, field, value) => {
    const updated = [...settings.hobbies];
    updated[index][field] = value;
    setSettings(prev => ({ ...prev, hobbies: updated }));
  };

  const handleHobbyImageUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updated = [...settings.hobbies];
      updated[index].image = res.data.fileUrl;
      setSettings(prev => ({ ...prev, hobbies: updated }));
      showToast('Hobby image uploaded successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload hobby image.', true);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      showToast('Portfolio settings saved successfully.');
      loadPortfolioData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings.', true);
    }
  };

  // --- Asset Uploader Operations ---
  const handleRawFileUpload = async (file) => {
    setRawUploadStatus(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedUrl(res.data.fileUrl);
      setRawUploadStatus('Upload complete');
      showToast('Asset uploaded successfully.');
    } catch (err) {
      console.error(err);
      setRawUploadStatus('Upload failed');
      showToast('Failed to upload asset.', true);
    }
  };

  if (loading && portfolioData.projects.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#060709' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="#ccff00" strokeWidth="2.5" fill="none" style={{ animation: 'spin 1.2s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(204,255,0,0.1)"></circle>
            <path d="M4 12a8 8 0 0 1 8-8" stroke="#ccff00"></path>
          </svg>
          <p style={{ color: '#ccff00', fontSize: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>LOADING DATABASE STATE...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Toast alert */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.error ? 'toast-error' : ''}`}>
        {toast.error ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        )}
        <span>{toast.message}</span>
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            NISHAD
            <span>DASHBOARD</span>
          </div>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('overview')}>
                <svg viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Overview
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('projects')}>
                <svg viewBox="0 0 24 24">
                  <path d="M10 16v-1H3.01L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4h-7v1h-4zm10-9h-4.01V5c0-1.1-.9-2-2-2h-3.98c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z"/>
                </svg>
                Projects Manager
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'identity' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('identity')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Identity & Bio
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'profile-images' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('profile-images')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Profile Images
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'experience' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('experience')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Work Experience
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'achievements' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('achievements')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Achievements
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'hobbies' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('hobbies')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Hobbies Gallery
              </button>
            </li>
             <li className={`menu-item ${activeTab === 'uploads' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('uploads')}>
                <svg viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                Asset Uploader
              </button>
            </li>
            <li className={`menu-item ${activeTab === 'messages' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('messages')}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Messages
              </button>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="main-content">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Dashboard<span>Overview</span></h1>
              <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer" className="btn-action btn-secondary" style={{ textDecoration: 'none' }}>
                <span>View Website</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59L8.12 14.47l1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
              </a>
            </div>
            
            <div className="dash-stats-grid">
              <div className="stat-card">
                <div className="stat-card-details">
                  <span className="stat-label">Total Projects</span>
                  <span className="stat-val">{portfolioData.projects.length}</span>
                </div>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-details">
                  <span className="stat-label">Experience Entries</span>
                  <span className="stat-val">{settings.experience.length}</span>
                </div>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-details">
                  <span className="stat-label">Achievements</span>
                  <span className="stat-val">{settings.achievements.length}</span>
                </div>
                <div className="stat-card-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.5 1.84 4.57 4.25 4.94C8.19 18.02 10.16 19 12 19c1.84 0 3.81-.98 4.75-3.06C19.16 15.57 21 13.5 21 11V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3zM12 17c-1.1 0-2-.9-2-2v-1h4v1c0 1.1-.9 2-2 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <h2>MongoDB Atlas Cloud Cluster</h2>
              <p style={{ color: '#a0a0a5', lineHeight: '1.7', marginBottom: '1.8rem' }}>
                This administrative dashboard is connected to MongoDB Atlas. Changes to your projects, achievements, and professional timeline are written immediately to your secure cloud database cluster and propagate live to your portfolio visitors.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#a0a0a5', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cluster Status</span>
                  <strong style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '0.95rem' }}>Primary Replica Set (Active)</strong>
                </div>
                <div className="connection-status-container">
                  <span style={{ fontSize: '0.85rem', color: '#ccff00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected</span>
                  <div className="pulse-dot"></div>
                </div>
              </div>
            </div>
          </section>
        )}
 
        {/* Tab 2: Projects Manager */}
        {activeTab === 'projects' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Projects<span>Manager</span></h1>
            </div>
            
            <div className="admin-card" id="project-form">
              <h2>{projId ? 'Edit Project Details' : 'Add New Showcase Project'}</h2>
              <form onSubmit={handleProjectSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Solaris App" 
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Year</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 2026" 
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      className="form-control" 
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                    >
                      <option value="design">Visual Design</option>
                      <option value="development">Full Stack Development</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Display Image URL</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. uploads/file-xxx.png" 
                      value={projImage}
                      onChange={(e) => setProjImage(e.target.value)}
                    />
                  </div>
                  <div className="form-row-full form-group" style={{ marginBottom: 0 }}>
                    <label>Project Mockup Showcase File</label>
                    <div 
                      className="upload-zone"
                      onClick={() => document.getElementById('project-img-file').click()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      <p>{projUploading ? 'Uploading file...' : 'Click to select project showcase image or drag & drop here'}</p>
                      {projImage ? (
                        <span>Selected: {projImage}</span>
                      ) : (
                        <span style={{ color: '#4b4b54' }}>Accepts PNG, JPG, WebP (Mockup Aspect Ratio 16:10 Recommended)</span>
                      )}
                      <input 
                        type="file" 
                        id="project-img-file" 
                        className="file-input" 
                        accept="image/*"
                        onChange={(e) => e.target.files.length > 0 && handleProjectImageUpload(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn-action">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    {projId ? 'Update Project' : 'Create Project'}
                  </button>
                  {projId && (
                    <button type="button" className="btn-action btn-secondary" onClick={resetProjectForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
 
            <div className="admin-card">
              <h2>Existing Showcase Projects</h2>
              <table className="manager-list">
                <thead>
                  <tr>
                    <th>Mockup</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.projects.map((project) => (
                    <tr key={project._id}>
                      <td>
                        <img 
                          src={project.image?.startsWith('/') || project.image?.startsWith('http') ? project.image : `http://localhost:5000/${project.image || 'assets/project_celesia.png'}`} 
                          alt={project.name} 
                        />
                      </td>
                      <td><strong>{project.name}</strong></td>
                      <td>
                        <span className={`badge-outline ${project.category}`}>
                          {project.category === 'design' ? 'Visual Design' : 'Development'}
                        </span>
                      </td>
                      <td>{project.year}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn-table btn-table-edit" onClick={() => startEditProject(project)}>
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            Edit
                          </button>
                          <button className="btn-table btn-table-delete" onClick={() => handleDeleteProject(project._id)}>
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {portfolioData.projects.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#a0a0a5', padding: '3rem' }}>No showcase projects found. Create one above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
 
        {/* Tab 3a: Identity & Bio */}
        {activeTab === 'identity' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Identity<span>& Bio</span></h1>
            </div>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="admin-card">
                <h2>Bio & Branding Settings</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Developer Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settings.name} 
                      onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Website Title / Tagline</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settings.title} 
                      onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group form-row-full">
                    <label>Bio Summary</label>
                    <textarea 
                      className="form-control" 
                      value={settings.bio} 
                      onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={settings.email} 
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Resume PDF Link</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settings.resumeUrl} 
                      onChange={(e) => setSettings(prev => ({ ...prev, resumeUrl: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Social URLs */}
              <div className="admin-card">
                <h2>Social Network URLs</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>X (Twitter) Link</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={settings.socials.twitter} 
                      onChange={(e) => setSettings(prev => ({ ...prev, socials: { ...prev.socials, twitter: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn Profile Link</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={settings.socials.linkedin} 
                      onChange={(e) => setSettings(prev => ({ ...prev, socials: { ...prev.socials, linkedin: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group form-row-full">
                    <label>Instagram URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={settings.socials.instagram} 
                      onChange={(e) => setSettings(prev => ({ ...prev, socials: { ...prev.socials, instagram: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button type="submit" className="btn-action" style={{ minWidth: '220px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tab 3b: Profile Images */}
        {activeTab === 'profile-images' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Profile<span>Images</span></h1>
            </div>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="admin-card">
                <h2>Branding & Profile Images</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Home Banner / Hero Portrait Image (Landing Page Image)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {settings.bannerImage && (
                        <div style={{ width: '120px', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)', backgroundColor: '#121214' }}>
                          <img 
                            src={settings.bannerImage.startsWith('/') || settings.bannerImage.startsWith('http') ? settings.bannerImage : `/${settings.bannerImage}`} 
                            alt="Banner Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => e.target.files.length > 0 && handleBannerImageUpload(e.target.files[0])}
                        style={{ display: 'block' }}
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Or paste an image URL directly"
                        value={settings.bannerImage} 
                        onChange={(e) => setSettings(prev => ({ ...prev, bannerImage: e.target.value }))} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>About Page Portrait Image</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {settings.aboutImage && (
                        <div style={{ width: '120px', height: '120px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)', backgroundColor: '#121214' }}>
                          <img 
                            src={settings.aboutImage.startsWith('/') || settings.aboutImage.startsWith('http') ? settings.aboutImage : `/${settings.aboutImage}`} 
                            alt="About Portrait Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => e.target.files.length > 0 && handleAboutImageUpload(e.target.files[0])}
                        style={{ display: 'block' }}
                      />
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Or paste an image URL directly"
                        value={settings.aboutImage} 
                        onChange={(e) => setSettings(prev => ({ ...prev, aboutImage: e.target.value }))} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button type="submit" className="btn-action" style={{ minWidth: '220px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tab 3c: Work Experience */}
        {activeTab === 'experience' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Work<span>Experience</span></h1>
            </div>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="admin-card">
                <h2>Work Experience Timeline</h2>
                {settings.experience.map((exp, idx) => (
                  <div key={idx} className="nested-list-item">
                    <button type="button" className="btn-remove-nested" onClick={() => handleRemoveExperience(idx)}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      Remove
                    </button>
                    <div className="form-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-group">
                        <label>Role</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Jr. Web Developer (Intern)"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Company</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Zeneom Lab"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. 2025"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group form-row-full" style={{ marginBottom: 0 }}>
                        <label>Responsibilities & Details</label>
                        <textarea 
                          className="form-control" 
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-add-nested" onClick={handleAddExperience}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Experience Entry
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button type="submit" className="btn-action" style={{ minWidth: '220px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tab 3d: Achievements */}
        {activeTab === 'achievements' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Timeline<span>Achievements</span></h1>
            </div>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="admin-card">
                <h2>Academic & Professional Achievements</h2>
                {settings.achievements.map((ach, idx) => (
                  <div key={idx} className="nested-list-item">
                    <button type="button" className="btn-remove-nested" onClick={() => handleRemoveAchievement(idx)}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      Remove
                    </button>
                    <div className="form-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-group">
                        <label>Card Title</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. NIT Calicut"
                          value={ach.title}
                          onChange={(e) => handleAchievementChange(idx, 'title', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Topic / Subtitle</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. B.Tech Computer Science"
                          value={ach.subtitle}
                          onChange={(e) => handleAchievementChange(idx, 'subtitle', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. 2025"
                          value={ach.year}
                          onChange={(e) => handleAchievementChange(idx, 'year', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group form-row-full" style={{ marginBottom: 0 }}>
                        <label>Details / Summary</label>
                        <textarea 
                          className="form-control" 
                          value={ach.description}
                          onChange={(e) => handleAchievementChange(idx, 'description', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-add-nested" onClick={handleAddAchievement}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Achievement Card
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button type="submit" className="btn-action" style={{ minWidth: '220px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Tab 3e: Hobbies Gallery */}
        {activeTab === 'hobbies' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Hobbies<span>Gallery</span></h1>
            </div>
            
            <form onSubmit={handleSettingsSubmit}>
              <div className="admin-card">
                <h2>Travel & Hobbies Gallery</h2>
                <p style={{ color: '#a0a0a5', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  Add beautiful images of your travels, achievements, or hobbies. These will render in a gallery on your About page.
                </p>
                {settings.hobbies.map((hobby, idx) => (
                  <div key={idx} className="nested-list-item" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-dark)', borderRadius: '10px' }}>
                    <button type="button" className="btn-remove-nested" onClick={() => handleRemoveHobby(idx)}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      Remove Item
                    </button>
                    <div className="form-grid" style={{ marginTop: '1rem' }}>
                      <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {hobby.image && (
                          <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)', backgroundColor: '#121214', flexShrink: 0 }}>
                            <img 
                              src={hobby.image.startsWith('/') || hobby.image.startsWith('http') ? hobby.image : `/${hobby.image}`} 
                              alt="Hobby Preview" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                        )}
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files.length > 0 && handleHobbyImageUpload(idx, e.target.files[0])}
                            style={{ display: 'block' }}
                          />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Or paste an image URL directly"
                            value={hobby.image || ''} 
                            onChange={(e) => handleHobbyChange(idx, 'image', e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <label>Caption / Location</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Sunbeams in Redwood forest"
                          value={hobby.caption || ''}
                          onChange={(e) => handleHobbyChange(idx, 'caption', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-add-nested" onClick={handleAddHobby}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Travel/Hobby Image
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', marginBottom: '3rem' }}>
                <button type="submit" className="btn-action" style={{ minWidth: '220px' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Save Settings
                </button>
              </div>
            </form>
          </section>
        )}
 
        {/* Tab 4: Asset Uploader */}
        {activeTab === 'uploads' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Asset<span>Uploader</span></h1>
            </div>
            
            <div className="admin-card">
              <h2>Upload Static Cloud Resources</h2>
              <p style={{ color: '#a0a0a5', fontSize: '0.9rem', marginBottom: '2.2rem', lineHeight: '1.6' }}>
                Upload media like a new PDF resume, images, or documents. After uploading, you can copy the URL path directly from the panel below and paste it in the Timeline Experience, Achievements, or Projects modules.
              </p>
              
              <div 
                className="upload-zone"
                onClick={() => document.getElementById('raw-file').click()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <p>Drag & drop or click here to upload files</p>
                <span>{rawUploadStatus}</span>
                <input 
                  type="file" 
                  id="raw-file" 
                  className="file-input" 
                  onChange={(e) => e.target.files.length > 0 && handleRawFileUpload(e.target.files[0])}
                />
              </div>
 
              {uploadedUrl && (
                <div style={{ background: 'rgba(204, 255, 0, 0.03)', border: '1px solid rgba(204, 255, 0, 0.15)', borderRadius: '10px', padding: '1.5rem', marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#ccff00', fontWeight: 600, display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Uploaded File Path (Copy & Paste in Settings or Projects)
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={uploadedUrl} 
                      readOnly 
                      onClick={(e) => {
                        e.target.select();
                        navigator.clipboard.writeText(uploadedUrl);
                        showToast("Path copied to clipboard!");
                      }}
                      style={{ color: '#ccff00', fontFamily: 'monospace', cursor: 'pointer', flexGrow: 1 }}
                    />
                    <button 
                      type="button" 
                      className="btn-action" 
                      onClick={() => {
                        navigator.clipboard.writeText(uploadedUrl);
                        showToast("Path copied to clipboard!");
                      }}
                      style={{ padding: '0 1.5rem' }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tab 5: Messages Manager */}
        {activeTab === 'messages' && (
          <section className="tab-panel active">
            <div className="page-header">
              <h1>Contact<span>Messages</span></h1>
              <button className="btn-action btn-secondary" onClick={loadMessages} disabled={messagesLoading}>
                {messagesLoading ? 'Refreshing...' : 'Refresh Messages'}
              </button>
            </div>
            
            <div className="admin-card">
              <h2>Inbound Form Submissions</h2>
              <p style={{ color: '#a0a0a5', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                View and manage the incoming queries and email leads submitted through the website's contact form.
              </p>
              
              {messagesLoading && messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#ccff00' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#a0a0a5', border: '1px dashed var(--border-dark)', borderRadius: '12px' }}>
                  No messages received yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {messages.map((msg) => (
                    <div 
                      key={msg._id} 
                      className="nested-list-item" 
                      style={{ 
                        padding: '2rem', 
                        border: '1px solid var(--border-light)', 
                        background: 'rgba(255,255,255,0.01)', 
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        transition: 'border-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.15rem', color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>{msg.name}</strong>
                          <a href={`mailto:${msg.email}`} style={{ color: '#ccff00', fontSize: '0.9rem', textDecoration: 'underline' }}>{msg.email}</a>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.8rem', color: '#a0a0a5', display: 'block' }}>Received On</span>
                          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 500 }}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#a0a0a5', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                          Subject: {msg.subject || '(No Subject)'}
                        </span>
                        <p style={{ color: '#e0e0e5', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
 
      </main>
    </div>
  );
}

export default Dashboard;
