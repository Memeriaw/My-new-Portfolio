const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    profile: {
      type: Object,
      required: true
    },
    skills: {
      type: Array,
      default: []
    },
    experiences: {
      type: Array,
      default: []
    },
    testimonials: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', ProfileSchema);
