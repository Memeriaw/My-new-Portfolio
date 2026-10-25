import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Send, Mail, MapPin, Heart } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { usePortfolioProfile } from '../context/ProfileContext';

export const Footer = () => {
  const { portfolioData } = usePortfolioProfile();
  const profile = portfolioData.profile;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand info */}
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <img src="/images/brand-photo.png" alt="" className="nav-logo-icon" />
              <span>Memeriaw<span className="gradient-text">.dev</span></span>
            </Link>
            <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Full-Stack Developer & Creative Technologist based in Addis Ababa, Ethiopia. Crafting robust web applications and high-impact visual media.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <MapPin size={16} /> Addis Ababa, Ethiopia
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Me</Link></li>
              <li><Link to="/projects" style={{ color: 'var(--text-secondary)' }}>Projects</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Get In Touch</Link></li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={profile.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="hero-social-link"
                title="Telegram @lectern21"
              >
                <Send size={18} />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="hero-social-link"
                title="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hero-social-link"
                title="GitHub Profile"
                aria-label="Visit my GitHub profile"
              >
                <Github size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hero-social-link"
                title="Send Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Memeriaw Adugnaw. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Built with React, Node.js & MongoDB</span>
            <button
              onClick={scrollToTop}
              className="btn-icon"
              style={{ width: '36px', height: '36px' }}
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
