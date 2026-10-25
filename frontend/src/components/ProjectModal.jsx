import React, { useEffect } from 'react';
import { X, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';
import { Github } from './Icons';

export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              {project.categoryLabel || project.category}
            </span>
            <h3 style={{ fontSize: '1.4rem' }}>{project.title}</h3>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Video or Image Preview */}
          {project.videoUrl ? (
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', background: '#000' }}>
              <video
                src={project.videoUrl}
                controls
                poster={project.image}
                style={{ width: '100%', maxHeight: '420px', display: 'block' }}
              />
            </div>
          ) : (
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Metric Highlight */}
          {project.metrics && (
            <div className="project-metric" style={{ marginBottom: '1.5rem' }}>
              <Zap size={16} />
              <span>Key Metric / Impact: <strong>{project.metrics}</strong></span>
            </div>
          )}

          {/* Detailed Overview */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Project Overview</h4>
            <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>Technologies & Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(project.tech || []).map((t, i) => (
                <span key={i} className="badge">
                  <CheckCircle2 size={13} style={{ color: 'var(--accent-primary)' }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <Github size={16} /> View Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
