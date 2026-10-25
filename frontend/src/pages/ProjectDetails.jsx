import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, ExternalLink, Zap, CheckCircle2, Share2, Check } from 'lucide-react';
import { Github } from '../components/Icons';

export const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await api.getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        setError(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const shareProject = async () => {
    const shareData = {
      title: project.title,
      text: project.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Project shared.');
        return;
      }
      if (!navigator.clipboard?.writeText) {
        setShareStatus('Sharing is not available in this browser.');
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      setShareStatus('Project link copied.');
    } catch (shareError) {
      if (shareError.name !== 'AbortError') {
        setShareStatus('Could not share the link. Please copy the page address from your browser.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Project Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The requested project could not be found or has been moved.
        </p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container-narrow">
        {/* Back Link */}
        <Link to="/projects" className="btn btn-sm btn-secondary" style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        {/* Title and metadata */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            {project.categoryLabel || project.category}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            {project.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {project.description}
          </p>
        </div>

        {/* Media Preview (Video or Image) */}
        {project.videoUrl ? (
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', background: '#000', boxShadow: 'var(--shadow-xl)' }}>
            <video
              src={project.videoUrl}
              controls
              poster={project.image}
              style={{ width: '100%', maxHeight: '500px', display: 'block' }}
            />
          </div>
        ) : (
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
            <img
              src={project.image}
              alt={project.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Metrics Pill */}
        {project.metrics && (
          <div className="project-metric" style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            <Zap size={18} />
            <span>Key Achievement: <strong>{project.metrics}</strong></span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={18} />
              <span>Launch Live App</span>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <Github size={18} />
              <span>View Source Code</span>
            </a>
          )}
          <button type="button" onClick={shareProject} className="btn btn-secondary">
            {shareStatus === 'Project link copied.' ? <Check size={18} /> : <Share2 size={18} />}
            <span>Share Project</span>
          </button>
        </div>
        {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}

        {/* Comprehensive Architecture / Details */}
        <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>System & Architecture Overview</h3>
          <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {project.fullDescription || project.description}
          </p>

          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Technologies & Stack Utilized</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {(project.tech || []).map((t, idx) => (
              <span key={idx} className="badge" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--accent-primary)' }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
