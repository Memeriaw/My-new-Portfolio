const mongoose = require('mongoose');
const Message = require('../models/Message');
const { isMongoActive } = require('../config/db');
const { loadStore, saveStore } = require('../config/jsonStore');
const { sendContactNotification } = require('../services/emailService');

// Helper to format message output
const formatMessage = (m) => {
  const obj = m.toObject ? m.toObject() : { ...m };
  obj.id = obj.id || (obj._id ? obj._id.toString() : '');
  return obj;
};

// @desc    Submit contact message from public form
// @route   POST /api/contact
// @access  Public (Rate limited)
const submitContact = async (req, res, next) => {
  try {
    const { name, email, telegram, subject, projectType, message, honeypot } = req.body;

    // Honeypot anti-spam check: if bot filled this hidden field, fake success
    if (honeypot) {
      console.log('🤖 Spam bot caught via honeypot field.');
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!'
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, a valid email, and your message.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    let savedMessage;
    if (isMongoActive()) {
      const savedMsg = await Message.create({
        name: name.trim(),
        email: email.trim(),
        telegram: (telegram || '').trim(),
        subject: (subject || 'General Inquiry').trim(),
        projectType: (projectType || 'Full-Stack Development').trim(),
        message: message.trim(),
        read: false,
        ip,
        userAgent
      });
      savedMessage = savedMsg.toObject();
    } else {
      const store = loadStore();
      savedMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        telegram: (telegram || '').trim(),
        subject: (subject || 'General Inquiry').trim(),
        projectType: (projectType || 'Full-Stack Development').trim(),
        message: message.trim(),
        read: false,
        ip,
        userAgent,
        createdAt: new Date().toISOString()
      };

      store.messages = [savedMessage, ...(store.messages || [])];
      saveStore(store);
    }

    let emailNotificationSent = false;
    try {
      await sendContactNotification(savedMessage);
      emailNotificationSent = true;
    } catch (emailError) {
      console.error(`Could not send contact email notification: ${emailError.message}`);
    }

    return res.status(201).json({
      success: true,
      message: emailNotificationSent
        ? 'Thank you! Your message has been sent successfully.'
        : 'Your message was saved, but its email notification could not be sent. It is available in the portfolio admin inbox.',
      emailNotificationSent,
      data: {
        id: savedMessage.id || savedMessage._id?.toString(),
        createdAt: savedMessage.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/admin/messages
// @access  Private (Admin)
const getAdminMessages = async (req, res, next) => {
  try {
    if (isMongoActive()) {
      const messages = await Message.find({}).sort({ createdAt: -1 });
      return res.status(200).json(messages.map(formatMessage));
    } else {
      const store = loadStore();
      return res.status(200).json(store.messages || []);
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Mark message as read/unread (Admin)
// @route   PATCH /api/admin/messages/:id
// @access  Private (Admin)
const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const isRead = read !== undefined ? !!read : true;

    if (isMongoActive()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = {
        $or: [
          { id: id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      };

      const message = await Message.findOneAndUpdate(
        query,
        { read: isRead },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      return res.status(200).json({ success: true, message: formatMessage(message) });
    } else {
      const store = loadStore();
      const message = (store.messages || []).find(
        m => m.id === id || m._id === id
      );

      if (!message) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      message.read = isRead;
      saveStore(store);
      return res.status(200).json({ success: true, message });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete message (Admin)
// @route   DELETE /api/admin/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = {
        $or: [
          { id: id },
          ...(isObjectId ? [{ _id: id }] : [])
        ]
      };

      const result = await Message.findOneAndDelete(query);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } else {
      const store = loadStore();
      const initialLen = (store.messages || []).length;
      store.messages = (store.messages || []).filter(m => m.id !== id && m._id !== id);

      if (store.messages.length === initialLen) {
        return res.status(404).json({ success: false, message: 'Message not found' });
      }

      saveStore(store);
      return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
  getAdminMessages,
  markMessageRead,
  deleteMessage
};
