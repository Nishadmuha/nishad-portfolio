import React, { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

function About() {
  const { settings, loading } = useContext(PortfolioContext);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <p style={{ color: '#ccff00', fontSize: '1.2rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>LOADING ABOUT...</p>
      </div>
    );
  }

  const experience = settings.experience || [];
  const achievements = settings.achievements || [];
  const socials = settings.socials || {};

  return (
    <>
      {/* Hero Section */}
      <section className="hero-about theme-dark container">
        <ScrollReveal>
          <h1 className="hero-huge-title">
            <div className="letter-highlight">ABOUT</div>
          </h1>
        </ScrollReveal>
      </section>

      {/* Intro Section */}
      <section className="intro-section theme-dark container">
        <div className="intro-cols">
          <ScrollReveal delay={1} className="intro-left">
            <div className="intro-img-wrap">
              <img src={settings.aboutImage || "assets/portrait_colored.png"} alt="Mohammed Nishad - Colored professional portrait" />
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={2} className="intro-right">
            <h2>Discover My Design Journey</h2>
            <p className="intro-bio">
              {settings.bio || "Hi, I'm Mohammed Nishad, a passionate Full Stack Web Developer. I specialize in building complete digital architectures—writing elegant, robust backend APIs while designing and tuning smooth, highly interactive frontend experiences."}
            </p>
            <p className="intro-bio">
              I believe software should not only execute instructions but also deliver visual clarity and a sense of responsiveness. By combining solid algorithms with modern typography and layout structures, I construct web systems that are as beautiful as they are scalable.
            </p>
            
            <ul className="social-links" style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
              {socials.twitter && (
                <li>
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </li>
              )}
              {socials.linkedin && (
                <li>
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </li>
              )}
              {socials.instagram && (
                <li>
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </li>
              )}
            </ul>
            
            {settings.resumeUrl && (
              <a href={settings.resumeUrl} className="btn-pill-solid" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Download Resume</a>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Experience Section */}
      <section className="theme-light">
        <div className="container">
          <div className="exp-cols">
            <ScrollReveal className="exp-left">
              <h2>My Work Experience</h2>
            </ScrollReveal>
            <div className="exp-right">
              {experience.map((exp, idx) => (
                <ScrollReveal key={idx} delay={idx + 1} className="exp-card">
                  <h3 className="exp-title">{exp.role}</h3>
                  <p className="exp-meta">{exp.company}</p>
                  <span className="exp-duration">{exp.duration}</span>
                  {exp.description && (
                    <p className="exp-desc" style={{ color: 'var(--text-gray-dark)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                      {exp.description}
                    </p>
                  )}
                </ScrollReveal>
              ))}
              {experience.length === 0 && (
                <ScrollReveal className="exp-card">
                  <p style={{ color: 'var(--text-gray-dark)' }}>No experience listed.</p>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section className="theme-dark container">
        <ScrollReveal>
          <h2>When I am not Working I am Travelling</h2>
        </ScrollReveal>
        
        <div className="hobbies-gallery">
          {settings.hobbies && settings.hobbies.length > 0 ? (
            settings.hobbies.map((hobby, idx) => (
              <ScrollReveal key={idx} delay={idx + 1} className="hobby-card" style={{ position: 'relative' }}>
                <img src={hobby.image} alt={hobby.caption || `Travel image ${idx + 1}`} />
                {hobby.caption && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    pointerEvents: 'none'
                  }}>
                    {hobby.caption}
                  </div>
                )}
              </ScrollReveal>
            ))
          ) : (
            <>
              <ScrollReveal delay={1} className="hobby-card">
                <img src="assets/travel_mountain.png" alt="Travel - Snowy mountain peaks" />
              </ScrollReveal>
              <ScrollReveal delay={2} className="hobby-card">
                <img src="assets/travel_coast.png" alt="Travel - basalt sea stacks at the coast" />
              </ScrollReveal>
              <ScrollReveal delay={3} className="hobby-card">
                <img src="assets/travel_urban.png" alt="Travel - Modern urban architecture geometric lines" />
              </ScrollReveal>
              <ScrollReveal delay={4} className="hobby-card">
                <img src="assets/travel_nature.png" alt="Travel - Sunbeams in Redwood forest" />
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      {/* Philosophy & Achievements Section */}
      <section className="theme-light">
        <ScrollReveal className="container philosophy-wrap">
          <p className="philosophy-quote">
            "Simplicity is the ultimate sophistication. In software design, complexity is easy to write but hard to maintain; true mastery lies in building solutions that feel light and clean."
          </p>
          
          <div className="achieve-grid">
            {achievements.map((ach, idx) => (
              <ScrollReveal key={idx} delay={idx + 1} className="achieve-card">
                <h4>{ach.title}</h4>
                <span className="badge">{ach.subtitle}</span>
                {ach.description && (
                  <p style={{ color: 'var(--text-gray-dark)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: '1.5' }}>{ach.description}</p>
                )}
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

export default About;
