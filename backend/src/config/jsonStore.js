const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const {
  initialProfile,
  initialSkills,
  initialProjects,
  initialExperiences,
  initialTestimonials
} = require('../utils/initialData');

const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'local-database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadStore() {
  if (!fs.existsSync(STORE_FILE)) {
    // Generate initial hashed password for default admin
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', salt);

    const initialStore = {
      admin: {
        id: 'admin-1',
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
        password: hashedPassword,
        name: 'Memeriaw Adugnaw',
        role: 'admin'
      },
      profile: {
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      },
      projects: initialProjects,
      messages: [
        {
          id: 'msg-1',
          name: 'Alex Johnson',
          email: 'alex@enterprise.com',
          telegram: '@alex_tech',
          subject: 'Contract Full-Stack Opportunity',
          projectType: 'Full-Stack Development',
          message: 'Hi Memeriaw, we saw your OmniFlow ERP project and would love to discuss a 6-month contract role building our customer portal.',
          read: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }

  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON store:', err.message);
    return {};
  }
}

function saveStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving local JSON store:', err.message);
    return false;
  }
}

module.exports = {
  loadStore,
  saveStore
};
