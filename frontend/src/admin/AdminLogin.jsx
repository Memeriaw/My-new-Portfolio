import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'var(--accent-gradient-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Admin Access</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Sign in to manage projects, messages, and profile content.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--status-error)',
              color: 'var(--status-error)',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                id="admin-email"
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                id="admin-password"
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Return to website */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={14} /> Return to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};
