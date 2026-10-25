/**
 * Memeriaw Portfolio - API Service Client
 * Handles full REST API communication with backend and offline/mock fallbacks.
 */

import { initialProfile, initialSkills, initialProjects, initialExperiences, initialTestimonials } from '../data/initialData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAssetUrl = (url) => {
  if (!url || !url.startsWith('/uploads/')) return url;
  return `${new URL(BASE_URL, window.location.origin).origin}${url}`;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('portfolio_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const requestAdmin = async (path, options = {}) => {
  let response;
  const headers = { ...getAuthHeaders(), ...options.headers };
  if (options.body instanceof FormData) delete headers['Content-Type'];
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error('Could not connect to the admin API. Make sure the backend is running.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'The admin API request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
};

// Local storage keys for standalone frontend mode
const STORAGE_PROJECTS = 'portfolio_local_projects';
const STORAGE_MESSAGES = 'portfolio_local_messages';

// Initialize local fallback storage if empty
const getStoredProjects = () => {
  const saved = localStorage.getItem(STORAGE_PROJECTS);
  if (!saved) {
    localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(initialProjects));
    return initialProjects;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return initialProjects;
  }
};

const getStoredMessages = () => {
  const saved = localStorage.getItem(STORAGE_MESSAGES);
  if (!saved) {
    const defaultMessages = [
      {
        id: 'msg-1',
        name: 'Alex Johnson',
        email: 'alex@enterprise.com',
        subject: 'Contract Full-Stack Opportunity',
        message: 'Hi Memeriaw, we saw your OmniFlow ERP project and would love to discuss a 6-month contract role building our customer portal.',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const saveStoredMessages = (messages) => {
  localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
};

export const api = {
  // --- Profile & Content ---
  async getProfile() {
    try {
      const res = await fetch(`${BASE_URL}/profile`, { headers: { 'Content-Type': 'application/json' } });
      if (res.ok) return await res.json();
    } catch {
      // Backend not running; return local profile data
    }
    return {
      profile: initialProfile,
      skills: initialSkills,
      experiences: initialExperiences,
      testimonials: initialTestimonials
    };
  },

  // --- Public Projects ---
  async getProjects() {
    try {
      const res = await fetch(`${BASE_URL}/projects`, { credentials: 'omit' });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : (data.projects || []);
      }
    } catch {
      // Fallback to local
    }
    return getStoredProjects().filter(p => p.published !== false);
  },

  async getProjectBySlug(slug) {
    try {
      const res = await fetch(`${BASE_URL}/projects/${slug}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback to local
    }
    const projects = getStoredProjects();
    const found = projects.find(p => p.slug === slug || p.id === slug);
    if (found) return found;
    throw new Error('Project not found');
  },

  // --- Contact Form Submission ---
  async submitContact(formData) {
    let res;
    try {
      res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {
      throw new Error('Could not connect to the contact service. Please try again later or contact me directly.');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'The contact service could not accept your message. Please try again later.');
    }
    if (!data.success) {
      throw new Error(data.message || 'Your message could not be submitted. Please try again later.');
    }
    return data;
  },

  // --- Admin Authentication ---
  async adminLogin(email, password) {
    const data = await requestAdmin('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!data.token || data.admin?.role !== 'admin') {
      throw new Error('The server did not return a valid administrator session.');
    }
    localStorage.setItem('portfolio_admin_token', data.token);
    localStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin));
    return data;
  },

  async getAdminSession() {
    const data = await requestAdmin('/auth/me');
    if (data.admin?.role !== 'admin') {
      const error = new Error('This account is not authorized for the admin dashboard.');
      error.status = 403;
      throw error;
    }
    return data.admin;
  },

  async getAdminProfile() {
    return requestAdmin('/profile');
  },

  async updateProfile(profileData) {
    return requestAdmin('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  async uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return requestAdmin('/profile/photo', {
      method: 'POST',
      body: formData
    });
  },

  async deleteProfilePhoto() {
    return requestAdmin('/profile/photo', { method: 'DELETE' });
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return requestAdmin('/profile/resume', {
      method: 'POST',
      body: formData
    });
  },

  async deleteResume() {
    return requestAdmin('/profile/resume', { method: 'DELETE' });
  },

  async adminLogout() {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch {
      // offline logout
    } finally {
      localStorage.removeItem('portfolio_admin_token');
      localStorage.removeItem('portfolio_admin_user');
    }
  },

  // --- Admin Project CRUD ---
  async getAdminProjects() {
    const data = await requestAdmin('/admin/projects');
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.projects)) return data.projects;
    throw new Error('The admin API returned an invalid projects response.');
  },

  async createProject(projectData) {
    return requestAdmin('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  async updateProject(id, projectData) {
    return requestAdmin(`/admin/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData)
    });
  },

  async deleteProject(id) {
    return requestAdmin(`/admin/projects/${id}`, { method: 'DELETE' });
  },

  // --- Admin Messages Management ---
  async getAdminMessages() {
    const data = await requestAdmin('/admin/messages');
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.messages)) return data.messages;
    throw new Error('The admin API returned an invalid messages response.');
  },

  async markMessageRead(id, read = true) {
    return requestAdmin(`/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read })
    });
  },

  async deleteMessage(id) {
    return requestAdmin(`/admin/messages/${id}`, { method: 'DELETE' });
  }
};
