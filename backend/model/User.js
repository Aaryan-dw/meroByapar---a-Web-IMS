const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name halnei parxa']
  },
  email: {
    type: String,
    required: [true, 'Email halnei parxa'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password nahalikana ta ka hunxa nih"],
    minlength: [6, 'password kamti ma 6 ota ta hunei paronih']
  },

  role: {
    type: String,
    enum: ['admin', 'cashier', 'manager', 'pending'],
    default: 'pending'   // ← new users start as pending until admin assigns
  },

  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  // Email verification
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);