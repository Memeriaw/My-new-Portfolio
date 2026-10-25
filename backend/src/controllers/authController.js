const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { isMongoActive } = require('../config/db');
const { loadStore } = require('../config/jsonStore');

// Generate JWT token helper
const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured before admin authentication can be used.');
  }
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Admin login & get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoActive()) {
      // Check MongoDB
      const admin = await Admin.findOne({ email: cleanEmail }).select('+password');
      if (!admin || admin.role !== 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const token = generateToken({
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      });

      return res.status(200).json({
        success: true,
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } else {
      // Local fallback storage
      const store = loadStore();
      const admin = store.admin;

      if (!admin || admin.role !== 'admin' || admin.email !== cleanEmail) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email and password.'
        });
      }

      const token = generateToken({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      });

      return res.status(200).json({
        success: true,
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Verify admin token and return current admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  logout,
  getMe
};
