const crypto = require('crypto');
const multer = require('multer');
const { UPLOAD_DIR } = require('../utils/uploadStorage');

const extensionsByMimeType = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const profilePhotoUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, callback) => {
      const extension = extensionsByMimeType[file.mimetype];
      callback(null, `profile-${crypto.randomUUID()}.${extension}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!extensionsByMimeType[file.mimetype]) {
      return callback(new Error('Upload a JPEG, PNG, or WebP image.'));
    }
    return callback(null, true);
  }
});

module.exports = { profilePhotoUpload };
