import React from 'react';
import { usePortfolioProfile } from '../context/ProfileContext';
import { ExperienceSection } from '../components/ExperienceSection';
import { getAssetUrl } from '../services/api';
import { Download, GraduationCap, Code, Video, Globe, Award, Sparkles, BookOpen } from 'lucide-react';

export const About = () => {
  const { portfolioData } = usePortfolioProfile();
  const profile = portfolioData.profile;

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <span className="section-badge">Full Biography</span>
          <h1 className="section-title">
            About <span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="section-description">
            The story behind the code, the creative mindset, and the drive to build high-performance software.
          </p>
        </div>

        {/* Narrative Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>
              Bridging Technical Engineering with Visual Impact
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              I am a final-year Information Systems student at Bahir Dar University, building a strong foundation in database modeling, algorithms, system analysis, and software design.
            </p>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Over time, I expanded my focus into modern full-stack web development with the MERN/Node.js stack—crafting scalable REST APIs, implementing robust authentication schemas, and engineering responsive React user interfaces that feel instantaneous.
            </p>
            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Simultaneously, my creative journey as a Video Editor has trained me to obsess over pacing, retention, visual harmony, and micro-details. Whether writing clean modular JavaScript or editing high-retention commercials, I deliver work that is both technically bulletproof and visually compelling.
            </p>

            <a
              href={getAssetUrl(profile.resumeUrl || '/resume.pdf')}
              download="Memeriaw_Adugnaw_Resume.pdf"
              className="btn btn-primary"
            >
              <Download size={18} />
              <span>Download Official Résumé</span>
            </a>
          </div>

          {/* Profile Card & Highlights */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={20} className="gradient-text" /> Core Background Highlights
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <GraduationCap size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Degree in Information Systems</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Bahir Dar, Ethiopia • System design, data structures, and database engineering.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Code size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Full-Stack Ecosystem</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>React, Node.js, Express, MongoDB Atlas, SQL, REST APIs, Git & Deployment.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Video size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Creative Video Post-Production</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>DaVinci Resolve, Premiere Pro, motion graphics, audio sync, and color grading.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Globe size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>International Collaboration</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Fluent English & Amharic, experienced in remote asynchronous workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Timeline */}
      <ExperienceSection />
    </div>
  );
};
