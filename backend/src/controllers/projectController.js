const mongoose = require('mongoose');
const Project = require('../models/Project');
const { isMongoActive } = require('../config/db');
const { loadStore, saveStore } = require('../config/jsonStore');

const PROJECT_STRING_LIMITS = {
  slug: 180,
  title: 160,
  categoryLabel: 120,
  image: 1000,
  videoUrl: 1000,
  description: 500,
  fullDescription: 10000,
  liveUrl: 1000,
  repoUrl: 1000,
  metrics: 240
};
const PROJECT_CATEGORIES = new Set(['fullstack', 'creative', 'systems', 'other']);

const sanitizeProjectData = (body, partial = false) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Project details must be an object.' };
  }

  const data = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === 'tech') {
      const items = typeof value === 'string' ? value.split(',') : value;
      if (!Array.isArray(items) || items.length > 50
        || items.some(item => typeof item !== 'string' || item.trim().length > 80)) {
        return { error: 'Technologies must be a list of at most 50 names.' };
      }
      data.tech = items.map(item => item.trim()).filter(Boolean);
      continue;
    }
    if (key === 'featured' || key === 'published') {
      if (typeof value !== 'boolean') return { error: `${key} must be true or false.` };
      data[key] = value;
      continue;
    }
    if (key === 'category') {
      if (typeof value !== 'string' || !PROJECT_CATEGORIES.has(value)) {
        return { error: 'Choose a valid project category.' };
      }
      data.category = value;
      continue;
    }

    const limit = PROJECT_STRING_LIMITS[key];
    if (!limit) return { error: `Project field "${key}" cannot be changed.` };
    if (typeof value !== 'string' || value.length > limit) {
      return { error: `${key} must be a string with at most ${limit} characters.` };
    }
    const cleanValue = value.trim();
    if (key === 'slug' && cleanValue && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanValue)) {
      return { error: 'Project slug may contain lowercase letters, numbers, and hyphens.' };
    }
    if (['image', 'videoUrl', 'liveUrl', 'repoUrl'].includes(key) && cleanValue) {
      if ((key === 'image' || key === 'videoUrl') && cleanValue.startsWith('/') && !cleanValue.startsWith('//')) {
        data[key] = cleanValue;
        continue;
      }
      try {
        const url = new URL(cleanValue);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
      } catch {
        return { error: `${key} must be a local path or valid HTTP/HTTPS URL.` };
      }
    }
    data[key] = cleanValue;
  }

  if (!partial && (!data.title || !data.description)) {
    return { error: 'Project title and short description are required.' };
  }
  if (partial && !Object.keys(data).length) {
    return { error: 'No project changes were provided.' };
  }
  return { data };
};

// Helper to normalize project JSON output
const formatProject = (p) => {
  const obj = p.toObject ? p.toObject() : { ...p };
  obj.id = obj.id || (obj._id ? obj._id.toString() : '');
  return obj;
};

// @desc    Get all published projects (Public)
// @route   GET /api/projects
// @access  Public
const getPublicProjects = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (isMongoActive()) {
      const query = { published: { $ne: false } };
      if (category && category !== 'all') {
        query.category = category;
      }
      const projects = await Project.find(query).sort({ createdAt: -1 });
      return res.status(200).json(projects.map(formatProject));
    } else {
      const store = loadStore();
      let projects = (store.projects || []).filter(p => p.published !== false);
      if (category && category !== 'all') {
        projects = projects.filter(p => p.category === category);
      }
      return res.status(200).json(projects);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project by slug or id (Public)
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlugOrId = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isMongoActive()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(slug);
      const query = {
        $or: [
          { slug: slug },
          { id: slug },
          ...(isObjectId ? [{ _id: slug }] : [])
        ]
      };
      const project = await Project.findOne(query);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.status(200).json(formatProject(project));
    } else {
      const store = loadStore();
      const project = (store.projects || []).find(
        p => p.slug === slug || p.id === slug || p._id === slug
      );
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.status(200).json(project);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects including drafts (Admin)
// @route   GET /api/admin/projects
// @access  Private (Admin)
const getAdminProjects = async (req, res, next) => {
  try {
    if (isMongoActive()) {
      const projects = await Project.find({}).sort({ createdAt: -1 });
      return res.status(200).json(projects.map(formatProject));
    } else {
      const store = loadStore();
      return res.status(200).json(store.projects || []);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project (Admin)
// @route   POST /api/admin/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
  try {
    const { data, error } = sanitizeProjectData(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (isMongoActive()) {
      const project = await Project.create(data);
      return res.status(201).json(formatProject(project));
    } else {
      const store = loadStore();
      const newId = `project-${Date.now()}`;
      const slug = data.slug || data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      const newProject = {
        ...data,
        id: newId,
        slug,
        createdAt: new Date().toISOString()
      };
      store.projects = [newProject, ...(store.projects || [])];
      saveStore(store);
      return res.status(201).json(newProject);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update project (Admin)
// @route   PATCH /api/admin/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data: updateData, error } = sanitizeProjectData(req.body, true);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (isMongoActive()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = {
        $or: [
          { id: id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      };

      const project = await Project.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true
      });

      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      return res.status(200).json(formatProject(project));
    } else {
      const store = loadStore();
      const index = (store.projects || []).findIndex(
        p => p.id === id || p._id === id
      );

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const updated = {
        ...store.projects[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      store.projects[index] = updated;
      saveStore(store);
      return res.status(200).json(updated);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project (Admin)
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = {
        $or: [
          { id: id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      };

      const result = await Project.findOneAndDelete(query);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } else {
      const store = loadStore();
      const initialLen = (store.projects || []).length;
      store.projects = (store.projects || []).filter(p => p.id !== id && p._id !== id);

      if (store.projects.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      saveStore(store);
      return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicProjects,
  getProjectBySlugOrId,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject
};
