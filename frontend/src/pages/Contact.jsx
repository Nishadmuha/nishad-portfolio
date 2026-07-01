import React, { useState, useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import api from '../api/api.js';

function Contact() {
  const { settings, loading } = useContext(PortfolioContext);
  const [openFAQIndex, setOpenFAQIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <p style={{ color: '#ccff00', fontSize: '1.2rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>LOADING CONTACT...</p>
      </div>
    );
  }

  const toggleFAQ = (index) => {
    setOpenFAQIndex(prev => prev === index ? -1 : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Name, email, and message are required.' });
      return;
    }
    
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      const res = await api.post('/messages', formData);
      setStatus({ type: 'success', message: res.data.message || 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      const errMsg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = settings.email || 'mohammednishadk2003@gmail.com';

  const faqs = [
    {
      q: "What services do you offer?",
      a: "I offer high-end Web Design, Full Stack Development, and cohesive Brand Identity solutions. Whether it's wireframing a user interface, writing robust PHP/Laravel or Node.js backend logic, or building interactive React frontends, I provide end-to-end web engineering."
    },
    {
      q: "How do you approach a new project?",
      a: "My workflow is divided into four main stages: Discovery (understanding objectives and technical stack scoping), Design (wireframes and mockup cycles), Development (clean, semantic engineering and backend implementation), and Testing/Deployment (optimization, cross-device QA, and secure hosting launches)."
    },
    {
      q: "What is your project timeline?",
      a: "Timelines depend on the scale of the application. Typically, a custom landing page or single-page portal spans 2–3 weeks. More complex full-stack web platforms with databases and user panels generally require 4–8 weeks from planning to production."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-contact theme-dark container">
        <ScrollReveal>
          <h1 className="hero-huge-title">
            <div className="letter-highlight">CONTACT</div>
          </h1>
        </ScrollReveal>
      </section>

      {/* Contact Form/Info Section */}
      <section className="contact-section theme-dark container">
        <ScrollReveal>
          <div className="contact-grid">
            {/* Left side: Contact Info */}
            <div className="contact-info">
              <h2 className="contact-info-title">Let's build something great together.</h2>
              <p className="contact-info-desc">
                Whether you have a fully formed project brief or just a concept you want to flesh out, drop me a line and let's start the conversation.
              </p>
              
              <div className="contact-details">
                <div className="contact-detail-item">
                  <span className="contact-detail-label">Email me</span>
                  <a href={`mailto:${email}`} className="contact-detail-value email-value">{email}</a>
                </div>
                {settings.location && (
                  <div className="contact-detail-item">
                    <span className="contact-detail-label">Location</span>
                    <span className="contact-detail-value" style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 400 }}>{settings.location}</span>
                  </div>
                )}
                {settings.phone && (
                  <div className="contact-detail-item">
                    <span className="contact-detail-label">Phone</span>
                    <a href={`tel:${settings.phone}`} className="contact-detail-value">{settings.phone}</a>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="contact-form-wrap">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Your Name" 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="name@example.com" 
                      className="form-input" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Project Inquiry / General Consultation" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell me about your project, goals, and timeline..." 
                    className="form-textarea" 
                    required 
                  />
                </div>

                {status.message && (
                  <div className={`form-status ${status.type}`}>
                    {status.type === 'success' ? '✓' : '✗'} {status.message}
                  </div>
                )}

                <div className="submit-btn-wrap">
                  <button 
                    type="submit" 
                    className="btn-pill-solid" 
                    disabled={isSubmitting}
                    style={{ minWidth: '180px', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ Accordion Section */}
      <section className="theme-light contact-faq-section">
        <div className="container">
          <div className="faq-cols">
            <ScrollReveal className="faq-left">
              <h2>Questions & Answers</h2>
            </ScrollReveal>
            <div className="faq-right">
              <div className="accordion-list">
                {faqs.map((faq, idx) => {
                  const isActive = openFAQIndex === idx;
                  return (
                    <ScrollReveal key={idx} delay={idx + 1} className={`accordion-item ${isActive ? 'active' : ''}`}>
                      <button className="accordion-btn" onClick={() => toggleFAQ(idx)}>
                        <span className="accordion-title">{faq.q}</span>
                        <span className="accordion-icon">{isActive ? '-' : '+'}</span>
                      </button>
                      <div 
                        className="accordion-content" 
                        style={{ 
                          maxHeight: isActive ? '300px' : '0px',
                          overflow: 'hidden',
                          transition: 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1)' 
                        }}
                      >
                        <p>{faq.a}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
