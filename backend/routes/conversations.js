const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Test route to get all conversations
router.get('/test/all', messageController.getAllConversations);

// Get all conversations for a user
router.get('/:userId', messageController.getConversations);

module.exports = router; 