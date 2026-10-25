const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email address'],
      trim: true,
      lowercase: true
    },
    telegram: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry'
    },
    projectType: {
      type: String,
      trim: true,
      default: 'Full-Stack Development'
    },
    message: {
      type: String,
      required: [true, 'Please provide your message text'],
      trim: true
    },
    read: {
      type: Boolean,
      default: false
    },
    ip: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.id || ret._id.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.id || ret._id.toString();
        return ret;
      }
    }
  }
);

MessageSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = `msg-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
