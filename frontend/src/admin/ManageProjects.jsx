import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Star,
  Search,
  X,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web App',
    image: '',
    videoUrl: '',
    description: '',
    fullDescription: '',
    tech: '',
    metrics: '',
    liveUrl: '',
    repoUrl: '',
    featured: false,
    published: true
  });
  const [notification, setNotification] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'fullstack',
      categoryLabel: 'Full-Stack Web App',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      videoUrl: '',
      description: '',
      fullDescription: '',
      tech: 'React, Node.js, Express, MongoDB',
      metrics: '',
      liveUrl: '',
      repoUrl: '',
      featured: false,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'fullstack',
      categoryLabel: project.categoryLabel || '',
      image: project.image || '',
      videoUrl: project.videoUrl || '',
      description: project.description || '',
      fullDescription: project.fullDescription || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : (project.tech || ''),
      metrics: project.metrics || '',
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      featured: !!project.featured,
      published: project.published !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await api.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        showToast(`Deleted "${title}" successfully.`);
        setActionError('');
      } catch (err) {
        setActionError(`Could not delete project: ${err.message}`);
      }
    }
  };

  const handleTogglePublished = async (project) => {
    const published = project.published === false;
    try {
      const updated = await api.updateProject(project.id, { published });
      setProjects(prev => prev.map(item => item.id === project.id ? { ...item, ...updated, published } : item));
      showToast(published ? 'Project published.' : 'Project unpublished.');
      setActionError('');
    } catch (err) {
      setActionError(`Could not update publication status: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setActionError('Project title and short description are required.');
      return;
    }

    const formattedTech = typeof formData.tech === 'string'
      ? formData.tech.split(',').map(s => s.trim()).filter(Boolean)
      : formData.tech;

    const projectPayload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      tech: formattedTech
    };

    setSaving(true);
    setActionError('');
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, projectPayload);
        showToast(`Updated "${formData.title}" successfully.`);
      } else {
        await api.createProject(projectPayload);
        showToast(`Created "${formData.title}" successfully.`);
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      setActionError(`Could not save project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query
      || [project.title, project.category, project.categoryLabel].some(value => value?.toLowerCase().includes(query));
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'published' ? project.published !== false : project.published === false);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {notification && (
        <div className="toast success" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 3000 }}>
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">Portfolio content</span>
          <h1>Manage projects</h1>
          <p>Search, publish, and update the work displayed on your portfolio.</p>
        </div>

        <button onClick={handleOpenNew} className="btn btn-primary">
          <Plus size={18} /> Add project
        </button>
      </div>

      {actionError && <div className="admin-alert error" role="alert">{actionError}</div>}
      {loadError && (
        <div className="admin-alert error" role="alert">
          <span>{loadError}</span>
          <button className="btn btn-sm btn-outline" onClick={loadProjects}>Retry</button>
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search size={16} />
        <input
          type="text"
          placeholder="Search title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>
        <select aria-label="Filter projects by category" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
          <option value="all">All categories</option>
          {[...new Set(projects.map(project => project.category).filter(Boolean))].sort().map(category => (
            <option value={category} key={category}>{category}</option>
          ))}
        </select>
        <select aria-label="Filter projects by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="admin-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    Loading projects...
                  </td>
                </tr>
              ) : !loadError && filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    {projects.length ? 'No projects match these filters.' : 'No projects found. Add your first project to get started.'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={project.image}
                          alt={project.title}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <strong className="admin-table-title">{project.title}</strong>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge">{project.categoryLabel || project.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${project.published !== false ? 'badge-primary' : ''}`}>
                        {project.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      {project.updatedAt || project.createdAt
                        ? new Date(project.updatedAt || project.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          onClick={() => handleTogglePublished(project)}
                          className="btn-icon"
                          style={{ width: '34px', height: '34px' }}
                          title={project.published === false ? 'Publish project' : 'Unpublish project'}
                          aria-label={project.published === false ? `Publish ${project.title}` : `Unpublish ${project.title}`}
                        >
                          {project.published === false ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="btn-icon"
                          style={{ width: '34px', height: '34px' }}
                          title="Edit Project"
                        >
                          <Edit2 size={15} />
                        </button>
                        {project.featured && <Star size={15} aria-label="Featured project" color="var(--status-warning)" />}
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="btn-icon"
                          style={{ width: '34px', height: '34px', color: 'var(--status-error)' }}
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-icon" aria-label="Close project form">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Task Queue"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const labelMap = {
                          fullstack: 'Full-Stack Web App',
                          systems: 'Systems & Algorithms',
                          creative: 'Video & Creative'
                        };
                        setFormData({ ...formData, category: val, categoryLabel: labelMap[val] || val });
                      }}
                    >
                      <option value="fullstack">Full-Stack</option>
                      <option value="systems">Systems & Algorithms</option>
                      <option value="creative">Creative & Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category Label</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.categoryLabel}
                      onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                      placeholder="e.g. Full-Stack Web App"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image Thumbnail URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Video URL (Optional for video edits)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://...mp4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description *</label>
                  <input
                    type="text"
                    required
                    maxLength={500}
                    className="form-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Concise 1-2 sentence overview"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Architecture Description</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed explanation of design decisions, architecture, and accomplishments"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technologies (Comma Separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    placeholder="React, Node.js, Express, MongoDB, SQL"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Metric / Performance Impact</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.metrics}
                    onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                    placeholder="e.g. Reduced latency by 45% • 120K Views"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Live Demo URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Source Code / Repo URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured on Home Page
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    Published / Publicly Visible
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving…' : 'Save project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
