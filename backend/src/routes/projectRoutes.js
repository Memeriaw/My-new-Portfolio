const express = require('express');
const router = express.Router();
const {
  getPublicProjects,
  getProjectBySlugOrId
} = require('../controllers/projectController');

router.get('/', getPublicProjects);
router.get('/:slug', getProjectBySlugOrId);

module.exports = router;
