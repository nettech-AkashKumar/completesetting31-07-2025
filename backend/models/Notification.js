const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'mention', 'reply'],
    default: 'message'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
NotificationSchema.index({ recipient: 1, read: 1, timestamp: -1 });

module.exports = mongoose.model('Notification', NotificationSchema); 