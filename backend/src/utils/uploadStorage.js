const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

module.exports = { UPLOAD_DIR };
