import React from 'react';
import { initialExperiences } from '../data/initialData';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export const ExperienceSection = () => {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Career & Background</span>
          <h2 className="section-title">
            Experience & <span className="gradient-text">Milestones</span>
          </h2>
          <p className="section-description">
            My career path across software engineering, academic systems, and creative production.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {initialExperiences.map((exp) => (
            <div key={exp.id} className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-gradient-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                  flexShrink: 0
                }}
              >
                <Briefcase size={22} />
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{exp.role}</h3>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-accent)', fontWeight: 600 }}>{exp.company}</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={15} />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                  <MapPin size={14} />
                  <span>{exp.location}</span>
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
