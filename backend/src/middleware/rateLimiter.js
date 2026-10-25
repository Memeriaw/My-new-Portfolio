const rateLimit = require('express-rate-limit');

// Rate limit for contact form submissions (prevents spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 submissions per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact messages sent from this IP. Please wait 15 minutes and try again.'
  }
});

// Rate limit for admin login attempts (prevents brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// General public API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  contactLimiter,
  loginLimiter,
  apiLimiter
};
