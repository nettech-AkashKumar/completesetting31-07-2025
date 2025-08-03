const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications for a user
router.get('/:userId', notificationController.getNotifications);

// Get unread notification count
router.get('/unread/:userId', notificationController.getUnreadCount);

// Mark notification as read
router.put('/read/:notificationId', notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/read-all/:userId', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Test route for debugging
router.post('/test', notificationController.testNotification);

module.exports = router; 