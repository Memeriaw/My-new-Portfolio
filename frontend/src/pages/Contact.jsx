import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { usePortfolioProfile } from '../context/ProfileContext';
import { Mail, MapPin, Send, Clock, ShieldCheck } from 'lucide-react';
import { Github, Linkedin } from '../components/Icons';

export const Contact = () => {
  const { portfolioData } = usePortfolioProfile();
  const profile = portfolioData.profile;

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Get In Touch</span>
          <h1 className="section-title">
            Let's Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p className="section-description">
            Available for software engineering roles, full-stack web applications, and creative video collaborations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Direct Details & Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Contact Information</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Email Address</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      <a href={`mailto:${profile.email}`} style={{ textDecoration: 'underline' }}>
                        {profile.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <Send size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Telegram Direct</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      <a href={profile.telegramUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                        {profile.telegram}
                      </a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>LinkedIn</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                        {profile.linkedin}
                      </a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Location</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Addis Ababa, Ethiopia (UTC+3)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Guarantee Card */}
            <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Clock size={24} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Fast Response Time</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  I typically respond to inquiries and project propositions within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};
