import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { ContactForm } from '../components/ContactForm';
import { api } from '../services/api';
import { ArrowRight, Sparkles, Send, MapPin, Mail } from 'lucide-react';

export const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const list = await api.getProjects();
        // Pick featured projects or first 3
        const featured = list.filter(p => p.featured);
        setFeaturedProjects(featured.length > 0 ? featured.slice(0, 3) : list.slice(0, 3));
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Featured Projects Highlight */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Selected Works</span>
            <h2 className="section-title">
              Featured <span className="gradient-text">Creations</span>
            </h2>
            <p className="section-description">
              A curated selection of full-stack web applications and visual media productions.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading featured projects...
            </div>
          ) : (
            <div className="grid grid-cols-3" style={{ marginBottom: '3rem' }}>
              {featuredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/projects" className="btn btn-primary">
              <span>Explore All Projects</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Quick Contact Section */}
      <section className="section" id="quick-contact">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Let's Connect</span>
            <h2 className="section-title">
              Have a Project in Mind? <span className="gradient-text">Let's Build It</span>
            </h2>
            <p className="section-description">
              Feel free to reach out for software engineering inquiries, contract roles, or video editing collaborations.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
