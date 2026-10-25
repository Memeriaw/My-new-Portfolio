import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '560px', padding: '3.5rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-error)', marginBottom: '1.5rem' }}>
          <AlertTriangle size={42} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '1rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <Compass size={18} /> Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
};
