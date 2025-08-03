const Notification = require('../models/Notification');
const User = require('../models/usersModels');

// Create a new notification
exports.createNotification = async (recipientId, senderId, type, title, message, conversationId = null, messageId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      conversationId,
      messageId
    });
    
    await notification.save();
    console.log(`📢 Notification created for user ${recipientId}: ${title}`);
    
    // Populate sender info for socket emission
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', '_id firstName lastName email profileImage');
    
    // Emit socket event for real-time notification
    const { getIO } = require('../utils/socket');
    const io = getIO();
    
    if (io) {
      console.log("📢 Notification Controller: Emitting new-notification event");
      console.log("📢 Notification Controller: Recipient:", recipientId);
      console.log("📢 Notification Controller: Notification data:", {
        recipient: recipientId,
        notification: populatedNotification
      });
      
      io.emit('new-notification', {
        recipient: recipientId,
        notification: populatedNotification
      });
    } else {
      console.log("📢 Notification Controller: io instance not available");
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = { recipient: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', '_id firstName lastName email profileImage')
      .populate('recipient', '_id firstName lastName email profileImage')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Notification.countDocuments(query);
    
    res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.body.userId;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} notifications marked as read` 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.body.userId;
    
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Test function to manually trigger a notification
exports.testNotification = async (req, res) => {
  try {
    const { recipientId, senderId, message } = req.body;
    
    const notification = await createNotification(
      recipientId,
      senderId,
      'message',
      'Test Notification',
      message || 'This is a test notification'
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Test notification created',
      notification 
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 