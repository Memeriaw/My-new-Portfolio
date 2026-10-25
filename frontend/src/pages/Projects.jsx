import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Search, AlertCircle, Bookmark } from 'lucide-react';

const SAVED_PROJECTS_KEY = 'portfolio_saved_projects';

const readSavedProjects = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_PROJECTS_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [savedProjectIds, setSavedProjectIds] = useState(readSavedProjects);
  const [storageError, setStorageError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full-Stack Apps' },
    { id: 'systems', label: 'Systems & Algorithms' },
    { id: 'creative', label: 'Video & Motion' }
  ];

  const toggleSaved = (project) => {
    const projectId = String(project.id ?? project.slug ?? project.title);
    const nextSaved = savedProjectIds.includes(projectId)
      ? savedProjectIds.filter((id) => id !== projectId)
      : [...savedProjectIds, projectId];
    setSavedProjectIds(nextSaved);
    setStorageError('');
    try {
      localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(nextSaved));
    } catch {
      setStorageError('Saved projects are available for this visit, but could not be stored in this browser.');
    }
  };

  // Filtering by category and search term
  const filteredProjects = projects.filter(p => {
    const projectId = String(p.id ?? p.slug ?? p.title);
    const matchesCategory = activeCategory === 'saved'
      ? savedProjectIds.includes(projectId)
      : activeCategory === 'all' || p.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.tech && p.tech.some(t => t.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Portfolio Showcase</span>
          <h1 className="section-title">
            Featured <span className="gradient-text">Projects & Work</span>
          </h1>
          <p className="section-description">
            Explore web applications, backend architectures, and multimedia video edits built for performance.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Search Input */}
          <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by technology (e.g. React, Node.js, SQL, DaVinci)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.8rem', borderRadius: 'var(--radius-full)' }}
            />
          </div>

          {/* Category Tabs */}
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => setActiveCategory('saved')}
              className={`filter-btn saved-filter ${activeCategory === 'saved' ? 'active' : ''}`}
              aria-pressed={activeCategory === 'saved'}
            >
              <Bookmark size={15} /> Saved ({savedProjectIds.length})
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {storageError && <p className="saved-project-notice" role="status">{storageError}</p>}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Loading portfolio projects...
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-3">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(p) => setSelectedProject(p)}
                isSaved={savedProjectIds.includes(String(project.id ?? project.slug ?? project.title))}
                onToggleSave={toggleSaved}
              />
            ))}
          </div>
        ) : (
          <div
            className="glass-card"
            style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}
          >
            <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No projects found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              We couldn't find any projects matching your search term. Try adjusting your query or category filter.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
