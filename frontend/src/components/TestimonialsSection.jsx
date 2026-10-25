import React from 'react';
import { initialTestimonials } from '../data/initialData';
import { Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section className="section" id="testimonials" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Client & Peer Feedback</span>
          <h2 className="section-title">
            What People Say <span className="gradient-text">About My Work</span>
          </h2>
          <p className="section-description">
            Testimonials from colleagues, clients, and partners.
          </p>
        </div>

        <div className="grid grid-cols-2">
          {initialTestimonials.map((t) => (
            <div key={t.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Quote size={28} style={{ color: 'var(--accent-primary)', opacity: 0.5, marginBottom: '0.75rem' }} />
                <p style={{ fontStyle: 'italic', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                  "{t.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
