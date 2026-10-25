import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageSquareText
} from 'lucide-react';
import { api } from '../services/api';

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
};

export const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([api.getAdminProjects(), api.getAdminMessages()])
      .then(([projectData, messageData]) => {
        if (!active) return;
        setProjects(projectData);
        setMessages(messageData);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const unreadCount = messages.filter(message => !message.read).length;
  const publishedCount = projects.filter(project => project.published !== false).length;
  const stats = [
    { label: 'Total projects', value: projects.length, icon: BriefcaseBusiness, tone: 'blue', hint: 'Across your portfolio' },
    { label: 'Published projects', value: publishedCount, icon: CheckCircle2, tone: 'green', hint: 'Visible to visitors' },
    { label: 'Total messages', value: messages.length, icon: Mail, tone: 'purple', hint: 'Portfolio inquiries' },
    { label: 'Unread inquiries', value: unreadCount, icon: MessageSquareText, tone: 'amber', hint: 'Awaiting your review' }
  ];

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 4);
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  return (
    <div className="admin-page">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow">Portfolio workspace</span>
          <h1>Welcome back, Memeriaw Adugnaw</h1>
          <p>Manage portfolio projects, messages, and profile content.</p>
        </div>
        <div className="admin-date-chip">
          <span className="admin-live-dot" />
          <span>Workspace overview</span>
        </div>
      </section>

      {error && (
        <div className="admin-alert error" role="alert">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <section className="admin-stat-grid" aria-label="Portfolio statistics">
        {stats.map(({ label, value, icon: Icon, tone, hint }) => (
          <article className="admin-stat-card" key={label}>
            <div className={`admin-stat-icon ${tone}`}><Icon size={20} /></div>
            <span className="admin-stat-label">{label}</span>
            <strong className="admin-stat-value">{loading ? '—' : value}</strong>
            <span className="admin-stat-hint">{hint}</span>
          </article>
        ))}
      </section>

      <div className="admin-content-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">Your work</span>
              <h2>Recent projects</h2>
            </div>
            <Link className="admin-text-link" to="/admin/projects">Manage all <ArrowRight size={15} /></Link>
          </div>
          {loading ? (
            <div className="admin-state">Loading project data…</div>
          ) : recentProjects.length === 0 ? (
            <div className="admin-state">No projects to display yet.</div>
          ) : (
            <div className="admin-activity-list">
              {recentProjects.map(project => (
                <article className="admin-activity-row" key={project.id || project._id}>
                  <div className="admin-activity-icon blue"><BriefcaseBusiness size={17} /></div>
                  <div className="admin-activity-copy">
                    <strong>{project.title}</strong>
                    <span>{project.categoryLabel || project.category || 'Uncategorized'}</span>
                  </div>
                  <div className="admin-activity-meta">
                    <span className={`admin-status ${project.published === false ? 'draft' : 'published'}`}>
                      {project.published === false ? 'Draft' : 'Published'}
                    </span>
                    <time>{formatDate(project.updatedAt || project.createdAt)}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">Inbox</span>
              <h2>Recent inquiries</h2>
            </div>
            <Link className="admin-text-link" to="/admin/messages">Open inbox <ArrowRight size={15} /></Link>
          </div>
          {loading ? (
            <div className="admin-state">Loading inquiries…</div>
          ) : recentMessages.length === 0 ? (
            <div className="admin-state">No inquiries have arrived yet.</div>
          ) : (
            <div className="admin-activity-list">
              {recentMessages.map(message => (
                <article className="admin-activity-row" key={message.id || message._id}>
                  <div className={`admin-activity-icon ${message.read ? 'purple' : 'amber'}`}><Mail size={17} /></div>
                  <div className="admin-activity-copy">
                    <strong>{message.name}</strong>
                    <span>{message.subject || message.message}</span>
                  </div>
                  <div className="admin-activity-meta">
                    <span className={`admin-status ${message.read ? 'read' : 'unread'}`}>{message.read ? 'Read' : 'Unread'}</span>
                    <time>{formatDate(message.createdAt)}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="admin-analytics-note">
        <div className="admin-activity-icon purple"><Eye size={18} /></div>
        <div>
          <strong>Traffic analytics are not available yet</strong>
          <p>Project views and inquiry trends are not currently tracked, so this dashboard only shows verified project and message totals.</p>
        </div>
        <Clock3 size={18} className="admin-note-trailing-icon" />
      </section>
    </div>
  );
};
