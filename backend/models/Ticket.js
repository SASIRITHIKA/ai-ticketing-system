const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // AI Generated Fields
  aiSummary: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Billing Issue', 'Technical Problem', 'Account Management', 'Feature Request', 'General Query'],
    default: 'General Query'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  assignedTeam: {
    type: String,
    enum: ['finance_team', 'technical_team', 'product_team', 'general_team'],
    default: 'general_team'
  },
  // Ticket Status
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  // Who submitted
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Remarks from team when resolving
  remarks: {
    type: String,
    default: ''
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);