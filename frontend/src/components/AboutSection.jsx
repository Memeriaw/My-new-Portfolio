import React from 'react';
import { usePortfolioProfile } from '../context/ProfileContext';
import { getAssetUrl } from '../services/api';
import { GraduationCap, Award, Target, Cpu, Download, CheckCircle2 } from 'lucide-react';

export const AboutSection = () => {
  const { portfolioData } = usePortfolioProfile();
  const profile = portfolioData.profile;

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">About Me</span>
          <h2 className="section-title">
            Engineering Systems, <span className="gradient-text">Crafting Visuals</span>
          </h2>
          <p className="section-description">
            Merging strong computer science foundations with artistic storytelling.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          {/* Narrative & Bio */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              BSc in Information Systems & Full-Stack Specialist
            </h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              {profile.bio}
            </p>
            <p style={{ lineHeight: '1.7', marginBottom: '1.75rem', color: 'var(--text-secondary)' }}>
              Whether developing secure REST APIs, architecting MongoDB / SQL database queries, or directing post-production video color grading, my goal is always identical: building experiences that perform with precision and leave a lasting impression.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <h4 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>3+</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Years Coding</span>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <h4 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>25+</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Projects Completed</span>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                <h4 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>100%</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Delivery Rate</span>
              </div>
            </div>

            <a
              href={getAssetUrl(profile.resumeUrl || '/resume.pdf')}
              download="Memeriaw_Adugnaw_Resume.pdf"
              className="btn btn-primary"
            >
              <Download size={18} />
              <span>Download Complete CV</span>
            </a>
          </div>

          {/* Core Strengths Highlights Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', color: 'var(--accent-primary)' }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Academic Degree</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Bachelor of Science in Information Systems. Deep focus on systems architecture, data structures, and enterprise networking.
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', color: 'var(--accent-primary)' }}>
                <Cpu size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Full-Stack Engineering</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Node.js, Express, MongoDB Atlas, SQL, React, JWT auth, input validation, and production server optimization.
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', color: 'var(--accent-primary)' }}>
                <Target size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Cinematic Media Production</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Professional video editing, DaVinci Resolve color grading, audio soundscape mastering, and dynamic short-form retention cutting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
