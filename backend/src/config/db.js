const mongoose = require('mongoose');
const { loadStore } = require('./jsonStore');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('⚠️  [Database] MONGODB_URI not provided in .env.');
    console.log('⚡ [Database] Using persistent local JSON database (data/local-database.json).');
    loadStore();
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500 // Don't hang more than 3.5s if local mongo isn't up
    });

    isMongoConnected = true;
    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);

    // Auto-seed MongoDB if collections are empty
    await autoSeedMongo();
  } catch (err) {
    isMongoConnected = false;
    console.log(`⚠️  [MongoDB] Connection notice: ${err.message}`);
    console.log('⚡ [Database] Running on local JSON fallback database (data/local-database.json).');
    console.log('💡 [Tip] To connect to MongoDB Atlas, add your connection URI in backend/.env:');
    console.log('   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/memeriaw_portfolio');
    loadStore();
  }
};

const autoSeedMongo = async () => {
  try {
    const Admin = require('../models/Admin');
    const Project = require('../models/Project');
    const Profile = require('../models/Profile');
    const {
      initialProfile,
      initialSkills,
      initialProjects,
      initialExperiences,
      initialTestimonials
    } = require('../utils/initialData');

    // Check admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: 'Memeriaw Adugnaw',
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log('🌱 [MongoDB Seed] Created default admin account (admin@example.com / admin123)');
    }

    // Check projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log(`🌱 [MongoDB Seed] Inserted ${initialProjects.length} initial projects`);
    }

    // Check profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      console.log('🌱 [MongoDB Seed] Inserted portfolio profile, skills & experiences');
    }
  } catch (seedErr) {
    console.error('Error during auto-seed:', seedErr.message);
  }
};

const isMongoActive = () => isMongoConnected;

module.exports = {
  connectDB,
  isMongoActive
};
