import React, { useState } from 'react';
import { usePortfolioProfile } from '../context/ProfileContext';
import { Code2, Server, Database, Film, Wrench, CheckCircle } from 'lucide-react';

export const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { portfolioData } = usePortfolioProfile();
  const skills = portfolioData.skills;

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'database', label: 'Databases' },
    { id: 'creative', label: 'Video & Creative' },
    { id: 'systems', label: 'Systems & Tools' }
  ];

  const filteredSkills = activeTab === 'all'
    ? skills
    : skills.filter(s => s.category === activeTab);

  const services = [
    {
      title: 'Full-Stack Development',
      desc: 'Building responsive React user interfaces paired with secure, performant Node.js/Express backends.',
      icon: Code2
    },
    {
      title: 'Database Architecture',
      desc: 'Designing schema models in MongoDB Atlas and relational SQL databases with optimal indexing.',
      icon: Database
    },
    {
      title: 'REST API & Auth Systems',
      desc: 'Developing authenticated API endpoints protected with JWT, bcrypt hashing, rate limiting, and CORS.',
      icon: Server
    },
    {
      title: 'Video Editing & Post-Production',
      desc: 'Commercial cuts, color correction, kinetic typography, and high-retention social media reels.',
      icon: Film
    }
  ];

  return (
    <section className="section" id="skills" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Skills & Services</span>
          <h2 className="section-title">
            Technical Arsenal & <span className="gradient-text">Core Services</span>
          </h2>
          <p className="section-description">
            A breakdown of my technical proficiencies and digital production capabilities.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-4" style={{ marginBottom: '4rem' }}>
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontSize: '1.15rem' }}>{srv.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {srv.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`filter-btn ${activeTab === c.id ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2">
          {filteredSkills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-pct">{skill.level}%</span>
              </div>
              <div className="skill-progress-bar">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
