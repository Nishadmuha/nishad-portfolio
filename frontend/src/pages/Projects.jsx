import React, { useState, useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

function Projects() {
  const { projects, loading } = useContext(PortfolioContext);
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <p style={{ color: '#ccff00', fontSize: '1.2rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>LOADING PROJECTS...</p>
      </div>
    );
  }

  const handleFilterChange = (category) => {
    setFilter(category);
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-projects theme-dark container">
        <ScrollReveal>
          <h1 className="hero-huge-title">
            <div className="letter-highlight">PROJECTS</div>
          </h1>
        </ScrollReveal>
      </section>

      {/* Portfolio Grid with dynamic filter tabs */}
      <section className="portfolio-filter-section theme-dark container">
        <ScrollReveal>
          <ul className="filter-tabs">
            <li 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('all')}
            >
              All
            </li>
            <li 
              className={`filter-tab ${filter === 'design' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('design')}
            >
              Visual Design
            </li>
            <li 
              className={`filter-tab ${filter === 'development' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('development')}
            >
              Development
            </li>
          </ul>
        </ScrollReveal>

        <div className="project-grid">
          {filteredProjects.map((project, idx) => (
            <ScrollReveal key={project._id || idx} delay={(idx % 4) + 1}>
              <article className="project-card" data-category={project.category} style={{ display: 'flex' }}>
                <div className="project-img-link">
                  <img src={project.image || 'assets/project_celesia.png'} alt={project.name} />
                </div>
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <span className="project-year">{project.year}</span>
                </div>
              </article>
            </ScrollReveal>
          ))}
          {filteredProjects.length === 0 && (
            <ScrollReveal style={{ gridColumn: 'span 2', textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: '#a0a0a5', fontFamily: 'Syne', fontSize: '1.2rem' }}>No projects found in this category.</p>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  );
}

export default Projects;
