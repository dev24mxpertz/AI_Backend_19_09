const Notification = require('../models/notificationModel');
const UserModel = require('../models/userModel');
const AdminUserModel = require("../models/AdminuserModel")

// Directly exporting the createNotification function using exports
exports.createNotification = async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  try {
    // Find the sender's username
    const sender = req.user.username; // Assuming sender is the username of the logged-in user

    // Create a new notification
    const notification = new Notification({ message, user: userId, sender });
    const savedNotification = await notification.save();

    let targetUser = await UserModel.findById(userId);
    let targetModel = UserModel;
    if (!targetUser) {
      targetUser = await AdminUserModel.findById(userId);
      targetModel = AdminUserModel;
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    // Push the notification ID to the user's notifications array
    await targetModel.findByIdAndUpdate(userId, { $push: { notifications: savedNotification._id } });
  
    // Populate the notification details
    const userWithNotifications = await targetModel.findById(userId).populate('notifications');

    console.log('Notification created and added to the user');
    // Respond with the notification details
    res.status(201).json({
      message: 'Notification created and added to the user',
      notificationDetails: {
        ...userWithNotifications.notifications[0].toObject(),
        sender: sender
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Error creating notification' });
  }
};

exports.deleteNotification = async (req, res) => {
  const { userId, notificationId } = req.params;

  if (!req.user || !req.user.id) {
    console.log('Unauthorized: User or user ID not found in request');
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    console.log('User ID from token:', req.user.id);
    console.log('User ID from request params:', userId);

    const notification = await Notification.findOne({ user: userId, _id: notificationId });
    if (!notification) {
      console.log('Notification not found');
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if the user is the owner of the notification or an admin
    if (req.user.role === 'admin' || req.user.id.toString() === userId) {
      await Notification.findOneAndDelete({ _id: notificationId });
      await UserModel.findByIdAndUpdate(userId, { $pull: { notifications: notificationId } });
      console.log('Notification deleted successfully');
      return res.json({ message: "Notification deleted successfully" });
    } else {
      console.log('Forbidden: User does not have permission to delete this notification');
      return res.status(403).json({ message: "Forbidden: You do not have permission to delete this notification." });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: error.message });
  }
};


  exports.getNotifications = async (req, res) => {
    try {
      const { userId } = req.params;
      const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.notificationread = async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
      res.json(notification);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  };
  