import React, { useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

function Footer() {
  const { settings } = useContext(PortfolioContext);
  const email = settings.email || 'mohammednishadk2003@gmail.com';
  const socials = settings.socials || {};

  return (
    <footer className="footer">
      <div className="container footer-content">
        <ScrollReveal>
          <h2 className="footer-quote">I'm not just writing code, I'm building tomorrow</h2>
        </ScrollReveal>
        
        <ScrollReveal delay={1}>
          <a href={`mailto:${email}`} className="footer-email-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
              <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 3.82v-7.64l4.623 3.82zm1.42 1.173l3.957 3.267 3.957-3.267 4.887 5.922h-17.688l4.887-5.922zm5.957-.024l4.623-3.82v7.64l-4.623-3.82zm-2.02-1.668l-9.98-8.25h19.96l-9.98 8.25z"/>
            </svg>
            <span>{email}</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <ul className="footer-socials">
            {socials.twitter && (
              <li>
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X">X (Twitter)</a>
              </li>
            )}
            {socials.linkedin && (
              <li>
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">LinkedIn</a>
              </li>
            )}
            {socials.instagram && (
              <li>
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">Instagram</a>
              </li>
            )}
          </ul>
        </ScrollReveal>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Mohammed Nishad. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
