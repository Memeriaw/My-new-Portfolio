const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Memeriaw Adugnaw',
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Admin password is required'],
      minlength: 6,
      select: false // Exclude from query results by default
    },
    role: {
      type: String,
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving if modified
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
