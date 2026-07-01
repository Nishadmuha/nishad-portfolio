import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Determine if navbar should be hidden out of view
  const isHidden = isScrolled && !isHovered && !isOpen;

  return (
    <>
      {/* Invisible hover trigger zone at the top of the viewport when navbar is hidden */}
      <div 
        className="navbar-hover-trigger"
        onMouseEnter={() => setIsHovered(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '25px',
          zIndex: 999,
          pointerEvents: isHidden ? 'auto' : 'none'
        }}
      />

      <nav 
        className="navbar" 
        id="navbar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.4s ease',
        }}
      >
        <div className="container navbar-container">
          <Link to="/" className="logo" onClick={closeMenu}>NISHAD<span className="logo-dot">.</span></Link>
          <ul className="nav-links">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink></li>
            <li><NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Services</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink></li>
          </ul>
          <button className={`nav-toggle ${isOpen ? 'open' : ''}`} aria-label="Toggle Menu" onClick={toggleMenu}>
            <span style={isOpen ? { transform: 'rotate(45deg) translate(6px, 6px)' } : {}}></span>
            <span style={isOpen ? { opacity: 0 } : {}}></span>
            <span style={isOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><NavLink to="/" end className="mobile-nav-link" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/about" className="mobile-nav-link" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/projects" className="mobile-nav-link" onClick={closeMenu}>Projects</NavLink></li>
          <li><NavLink to="/services" className="mobile-nav-link" onClick={closeMenu}>Services</NavLink></li>
          <li><NavLink to="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</NavLink></li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
