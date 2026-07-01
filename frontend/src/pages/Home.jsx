import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/PortfolioContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import StaggeredText from '../components/StaggeredText.jsx';

function Home() {
  const { settings, projects, loading } = useContext(PortfolioContext);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <p style={{ color: '#ccff00', fontSize: '1.2rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>LOADING PORTFOLIO...</p>
      </div>
    );
  }

  // Get featured projects (first 2 projects)
  const featuredProjects = projects.slice(0, 2);

  // Setup Name display
  const name = settings.name || "MOHAMMED NISHAD";
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'MOHAMMED';
  const lastName = nameParts.slice(1).join(' ') || 'NISHAD';

  return (
    <>
      {/* Hero Section */}
      <section className="hero-home theme-dark container">
        <h1 className="hero-huge-title">
          <StaggeredText text={firstName} />
          <StaggeredText text={lastName} />
        </h1>
        
        <ScrollReveal delay={2} className="hero-cols">
          <div className="hero-left">
            <p className="hero-desc">
              {settings.bio || "Full Stack Developer specializing in building scalable, high-performance web applications with a focus on clean code and seamless user experience."}
            </p>
            <Link to="/contact" className="btn-pill-outline">Schedule a consultation</Link>
          </div>
          <div className="hero-right">
            <div className="hero-img-wrap">
              <img src={settings.bannerImage || "assets/portrait_hoodie_bw.png"} alt="Mohammed Nishad - Cutout portrait in a hoodie" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Why Choose Me Section */}
      <section className="theme-light">
        <ScrollReveal className="container">
          <span className="badge-outline">Why Choose Me</span>
          <div className="why-cols">
            {(settings.whyChooseMe && settings.whyChooseMe.length > 0) ? (
              settings.whyChooseMe.map((item, idx) => (
                <ScrollReveal key={idx} delay={idx + 1} className="why-col">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </ScrollReveal>
              ))
            ) : (
              <>
                <ScrollReveal delay={1} className="why-col">
                  <h3>Full Stack Expertise</h3>
                  <p>I bridge the gap between elegant frontend interfaces and robust backend logic. From database design to responsive frontend rendering, I build cohesive digital systems that scale.</p>
                </ScrollReveal>
                <ScrollReveal delay={2} className="why-col">
                  <h3>Quality-Focused Development</h3>
                  <p>I write semantic, performant, and maintainable code. Every application is optimized for speed, search engines, and maximum compatibility, ensuring long-term technical durability.</p>
                </ScrollReveal>
                <ScrollReveal delay={3} className="why-col">
                  <h3>Reliability & Timely Delivery</h3>
                  <p>Communication and milestones form the foundation of my project workflow. I work transparently to deliver premium software within agreed schedules without compromising on design integrity.</p>
                </ScrollReveal>
              </>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Featured Projects Section */}
      <section className="theme-dark container">
        <ScrollReveal className="projects-header">
          <h2 className="section-title">Projects</h2>
          <Link to="/projects" className="btn-pill-outline">Browse all work</Link>
        </ScrollReveal>
        
        <div className="project-grid">
          {featuredProjects.map((project, idx) => (
            <ScrollReveal key={project._id || idx} delay={idx + 1}>
              <article className="project-card" data-category={project.category}>
                <Link to="/projects" className="project-img-link">
                  <img src={project.image || 'assets/project_celesia.png'} alt={project.name} />
                </Link>
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <span className="project-year">{project.year}</span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Creative Workflow Process */}
      <section className="theme-light">
        <ScrollReveal className="container">
          <div className="process-layout">
            <div className="process-left">
              <h2 className="section-title">My Creative Workflow</h2>
              <Link to="/contact" className="btn-pill-outline">Schedule a consultation</Link>
            </div>
            <div className="process-right">
              <div className="process-list">
                <ScrollReveal delay={1} className="process-item">
                  <div className="process-number">1</div>
                  <h3 class="process-title">Discovery</h3>
                  <p class="process-desc">Understanding project objectives, gathering user requirements, defining technical stacks, and mapping out the user experience roadmap.</p>
                </ScrollReveal>
                <ScrollReveal delay={2} className="process-item">
                  <div className="process-number">2</div>
                  <h3 class="process-title">Design</h3>
                  <p class="process-desc">Wireframing pages, styling layouts, iterating mockups, and crafting responsive user interface designs with highly premium visuals.</p>
                </ScrollReveal>
                <ScrollReveal delay={3} className="process-item">
                  <div className="process-number">3</div>
                  <h3 class="process-title">Development</h3>
                  <p class="process-desc">Translating interface mockups into robust code, implementing server functionality, testing APIs, and optimizing render performance.</p>
                </ScrollReveal>
                <ScrollReveal delay={4} className="process-item">
                  <div className="process-number">4</div>
                  <h3 class="process-title">Optimization & Launch</h3>
                  <p class="process-desc">Validating responsiveness across viewports, executing cross-browser checks, securing SSL integrations, and launching application builds.</p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Services summary section */}
      <section className="theme-dark container">
        <ScrollReveal className="services-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="section-title">Empowering Brands Through Design</h2>
          <p style={{ color: '#a0a0a5', maxWidth: '600px', margin: '1rem auto 0 auto', lineHeight: '1.6' }}>
            We combine high-performance code configurations with curated aesthetics to build premium web software.
          </p>
        </ScrollReveal>
        
        <div className="services-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <ScrollReveal delay={1} className="service-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Web Design</h3>
            <p style={{ color: '#a0a0a5', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Curating aesthetics, building interactive wireframes, custom layouts, and clean typographic grids in Figma.
            </p>
            <Link to="/services" style={{ color: '#ccff00', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>Read details &rarr;</Link>
          </ScrollReveal>

          <ScrollReveal delay={2} className="service-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Development</h3>
            <p style={{ color: '#a0a0a5', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Building performant client scripts, robust databases, clean backend logic, and scalable APIs in Node/React.
            </p>
            <Link to="/services" style={{ color: '#ccff00', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>Read details &rarr;</Link>
          </ScrollReveal>

          <ScrollReveal delay={3} className="service-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Brand Identity</h3>
            <p style={{ color: '#a0a0a5', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Establishing corporate guidelines, brand assets, logos, and custom color profiles to tell your product's story.
            </p>
            <Link to="/services" style={{ color: '#ccff00', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>Read details &rarr;</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

export default Home;
