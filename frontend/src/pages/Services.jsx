import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';

function Services() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-services theme-dark container">
        <ScrollReveal>
          <h1 className="hero-huge-title">
            <div className="letter-highlight">SERVICES</div>
          </h1>
        </ScrollReveal>
      </section>

      {/* Detailed Services List */}
      <section className="services-detail-list theme-dark container">
        
        {/* Service Block 1 */}
        <ScrollReveal className="service-detail-block">
          <div className="service-detail-left">
            <h2>Web Design</h2>
            <p className="service-detail-desc">
              Crafting beautiful, high-fidelity visual solutions that are tailored to your business objectives. I design custom user journeys with modern typography scales, high contrast interfaces, and smooth, micro-animated user components.
            </p>
            <ul className="service-tags">
              <li>UI/UX Design</li>
              <li>Wireframing</li>
              <li>Interactive Prototypes</li>
              <li>Typography Scales</li>
              <li>Design Systems</li>
              <li>Figma Layouts</li>
            </ul>
            <Link to="/contact" className="btn-pill-solid">Booking</Link>
          </div>
          <div className="service-detail-right">
            <img src="assets/service_design.png" alt="Sleek UI/UX visual web design concepts mockup" />
          </div>
        </ScrollReveal>

        {/* Service Block 2 */}
        <ScrollReveal className="service-detail-block">
          <div className="service-detail-left">
            <h2>Development</h2>
            <p className="service-detail-desc">
              Engineering robust, fast-loading, and completely secure web architectures. Whether building with PHP/Laravel or modern Javascript (Node.js, React, Vanilla JS), I deliver code structures optimized for responsiveness and high traffic.
            </p>
            <ul className="service-tags">
              <li>HTML5 & Semantic SEO</li>
              <li>CSS3 Architecture</li>
              <li>Vanilla Javascript & ES6</li>
              <li>PHP & Laravel</li>
              <li>Node.js Backends</li>
              <li>Database Schema Modeling</li>
            </ul>
            <Link to="/contact" className="btn-pill-solid">Booking</Link>
          </div>
          <div className="service-detail-right">
            <img src="assets/service_development.png" alt="Futuristic code blocks showing development service visual" />
          </div>
        </ScrollReveal>

        {/* Service Block 3 */}
        <ScrollReveal className="service-detail-block">
          <div className="service-detail-left">
            <h2>Brand Identity</h2>
            <p className="service-detail-desc">
              Formulating brand assets and visual rules to communicate your company's core values. From minimalist logo designs to guidelines on vector assets, corporate stationery, and color matching, I establish premium visual standards.
            </p>
            <ul className="service-tags">
              <li>Logo Design</li>
              <li>Vector Art</li>
              <li>Brand Style Books</li>
              <li>Corporate Identity</li>
              <li>Minimalist Business Cards</li>
              <li>Visual Guideline Systems</li>
            </ul>
            <Link to="/contact" className="btn-pill-solid">Booking</Link>
          </div>
          <div className="service-detail-right">
            <img src="assets/service_branding.png" alt="Minimalist brand design files stationary mockup" />
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

export default Services;
