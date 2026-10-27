const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['fullstack', 'creative', 'systems', 'other'],
      default: 'fullstack'
    },
    categoryLabel: {
      type: String,
      default: 'Full-Stack Web App'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    },
    videoUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true
    },
    fullDescription: {
      type: String,
      default: ''
    },
    tech: {
      type: [String],
      default: []
    },
    liveUrl: {
      type: String,
      default: ''
    },
    repoUrl: {
      type: String,
      default: ''
    },
    metrics: {
      type: String,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: true
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

// Auto-populate id and slug before validation if missing
ProjectSchema.pre('validate', function () {
  if (!this.id) {
    this.id = `project-${Date.now()}`;
  }

  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
