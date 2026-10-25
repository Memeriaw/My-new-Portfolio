const multer = require('multer');
const { UPLOAD_DIR } = require('../utils/uploadStorage');

const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, callback) => {
      const extension = file.originalname.split('.').pop()?.toLowerCase() || 'pdf';
      callback(null, `resume-${Date.now()}.${extension}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'application/pdf' && !file.originalname.toLowerCase().endsWith('.pdf')) {
      return callback(new Error('Upload a PDF resume file.'));
    }
    return callback(null, true);
  }
});

module.exports = { resumeUpload };
