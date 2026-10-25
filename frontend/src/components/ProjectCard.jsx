import React from 'react';
import { ExternalLink, Zap, Eye, Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { Github } from './Icons';

export const ProjectCard = ({ project, onSelect, isSaved = false, onToggleSave }) => {
  return (
    <div className="project-card">
      {/* Image / Thumbnail Container */}
      <div className="project-img-wrapper" onClick={() => onSelect(project)} style={{ cursor: 'pointer' }}>
        <img
          src={project.image}
          alt={project.title}
          className="project-img"
          loading="lazy"
        />
        <button
          type="button"
          className={`project-save-button${isSaved ? ' is-saved' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.(project);
          }}
          aria-label={`${isSaved ? 'Remove' : 'Save'} ${project.title} ${isSaved ? 'from' : 'to'} saved projects`}
          aria-pressed={isSaved}
          title={isSaved ? 'Remove from saved projects' : 'Save project'}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
        <span className="project-card-category">
          {project.categoryLabel || project.category}
        </span>
        {project.videoUrl && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Play size={20} fill="#ffffff" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="project-content">
        <h3
          className="project-title"
          onClick={() => onSelect(project)}
          style={{ cursor: 'pointer' }}
          title={project.title}
        >
          {project.title}
        </h3>

        <p className="project-desc">
          {project.description}
        </p>

        {/* Metrics Badge */}
        {project.metrics && (
          <div className="project-metric">
            <Zap size={14} />
            <span>{project.metrics}</span>
          </div>
        )}

        {/* Technologies Pills */}
        <div className="project-tags">
          {(project.tech || []).slice(0, 4).map((t, idx) => (
            <span key={idx} className="badge">
              {t}
            </span>
          ))}
          {(project.tech || []).length > 4 && (
            <span className="badge">+{project.tech.length - 4}</span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="project-footer">
          <button
            onClick={() => onSelect(project)}
            className="btn btn-sm btn-outline"
            style={{ padding: '0.4rem 0.8rem' }}
          >
            <Eye size={15} /> Details
          </button>

          <div className="project-links">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-icon"
                style={{ width: '34px', height: '34px' }}
                title="View Source Code"
                aria-label="View source code on GitHub"
              >
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-icon"
                style={{ width: '34px', height: '34px' }}
                title="View Live Demo"
                aria-label="View live project demo"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
