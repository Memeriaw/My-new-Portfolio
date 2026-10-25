const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const {
  getAdminMessages,
  markMessageRead,
  deleteMessage
} = require('../controllers/contactController');

// All admin routes require valid JWT bearer token
router.use(protectAdmin);

// Projects Management
router.get('/projects', getAdminProjects);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Messages Management
router.get('/messages', getAdminMessages);
router.patch('/messages/:id', markMessageRead);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
