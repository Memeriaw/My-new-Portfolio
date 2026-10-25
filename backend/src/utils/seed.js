require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const Message = require('../models/Message');
const {
  initialProfile,
  initialSkills,
  initialProjects,
  initialExperiences,
  initialTestimonials
} = require('./initialData');
const { loadStore, saveStore } = require('../config/jsonStore');

const seedData = async () => {
  const uri = process.env.MONGODB_URI;

  console.log('====================================================');
  console.log('🌱 Starting Portfolio Database Seed...');
  console.log('====================================================');

  if (uri) {
    try {
      console.log(`📡 Connecting to MongoDB: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB.');

      // Clear existing records
      await Promise.all([
        Admin.deleteMany(),
        Project.deleteMany(),
        Profile.deleteMany(),
        Message.deleteMany()
      ]);
      console.log('🗑️  Cleaned existing collections.');

      // Seed Admin
      const admin = await Admin.create({
        name: 'Memeriaw Adugnaw',
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase(),
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log(`👤 Created Admin: ${admin.email}`);

      // Seed Projects
      const projects = await Project.insertMany(initialProjects);
      console.log(`🚀 Inserted ${projects.length} showcase projects.`);

      // Seed Profile
      await Profile.create({
        profile: initialProfile,
        skills: initialSkills,
        experiences: initialExperiences,
        testimonials: initialTestimonials
      });
      console.log('📄 Inserted profile, skills, and experiences.');

      // Seed Sample Message
      await Message.create({
        name: 'Alex Johnson',
        email: 'alex@enterprise.com',
        telegram: '@alex_tech',
        subject: 'Contract Full-Stack Opportunity',
        projectType: 'Full-Stack Development',
        message: 'Hi Memeriaw, we saw your OmniFlow ERP project and would love to discuss a 6-month contract role building our customer portal.',
        read: false
      });
      console.log('📬 Inserted sample contact message.');

      console.log('====================================================');
      console.log('🎉 MongoDB database seeded successfully!');
      console.log('====================================================');
      process.exit(0);
    } catch (err) {
      console.log(`⚠️  Could not connect to MongoDB: ${err.message}`);
      console.log('⚡ Populating local JSON store instead...');
    }
  }

  // Fallback to JSON store
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

  saveStore(initialStore);
  console.log('🎉 Local fallback JSON store seeded successfully at data/local-database.json!');
  process.exit(0);
};

seedData();
