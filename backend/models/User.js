const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'technical_team', 'finance_team', 'product_team', 'general_team'],
    default: 'customer'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);