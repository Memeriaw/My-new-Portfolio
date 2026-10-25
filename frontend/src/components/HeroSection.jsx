import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Send,
  Mail,
  Terminal,
  Code
} from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { usePortfolioProfile } from '../context/ProfileContext';
import { getAssetUrl } from '../services/api';

export const HeroSection = () => {
  const { portfolioData } = usePortfolioProfile();
  const profile = portfolioData.profile;

  return (
    <section className="section hero-wrapper">
      <div className="container hero-container">
        {/* Left Column: Content */}
        <div className="hero-content" style={{ flex: '1.2', minWidth: '320px' }}>
          {/* Main Title */}
          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">{profile.name}</span>
          </h1>

          {/* Subtitle / Role */}
          <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, color: 'var(--text-accent)', marginBottom: '1rem' }}>
            {profile.title}
          </h2>

          <p className="hero-subtitle">
            {profile.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              <span>View My Work</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/contact" className="btn btn-secondary">
              <span>Contact Me</span>
            </Link>

            <a
              href={getAssetUrl(profile.resumeUrl || '/resume.pdf')}
              download="Memeriaw_Adugnaw_Resume.pdf"
              className="btn btn-outline"
              title="Download Résumé / CV"
            >
              <Download size={17} />
              <span>Resume</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-socials">
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>FIND ME ON</span>
            <a
              href={profile.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="hero-social-link"
              title={`Telegram: ${profile.telegram || 'Contact'}`}
              aria-label="Message me on Telegram"
            >
              <Send size={18} />
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hero-social-link"
              title="LinkedIn"
              aria-label="Visit my LinkedIn profile"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="hero-social-link"
              title="GitHub"
              aria-label="Visit my GitHub profile"
            >
              <Github size={18} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="hero-social-link"
              title="Email"
              aria-label="Send me an email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="hero-portrait">
          <img
            src={getAssetUrl(profile.photoUrl || '/images/profile.jpg')}
            alt={`${profile.name} profile`}
          />
        </div>
      </div>
    </section>
  );
};
