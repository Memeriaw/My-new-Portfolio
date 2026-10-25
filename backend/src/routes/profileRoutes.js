const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadResume,
  deleteResume
} = require('../controllers/profileController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { profilePhotoUpload } = require('../middleware/profilePhotoUpload');
const { resumeUpload } = require('../middleware/resumeUpload');

const handlePhotoUpload = (req, res, next) => {
  profilePhotoUpload.single('photo')(req, res, error => {
    if (error) {
      res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
      return next(error);
    }
    return next();
  });
};

const handleResumeUpload = (req, res, next) => {
  resumeUpload.single('resume')(req, res, error => {
    if (error) {
      res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
      return next(error);
    }
    return next();
  });
};

router.get('/', getProfile);
router.put('/', protectAdmin, updateProfile);
router.post('/photo', protectAdmin, handlePhotoUpload, uploadProfilePhoto);
router.delete('/photo', protectAdmin, deleteProfilePhoto);
router.post('/resume', protectAdmin, handleResumeUpload, uploadResume);
router.delete('/resume', protectAdmin, deleteResume);

module.exports = router;
