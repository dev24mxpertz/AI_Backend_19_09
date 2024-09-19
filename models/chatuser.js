// models/chatuser.js
const mongoose = require('mongoose');

const chatUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatUser = mongoose.model('ChatUser', chatUserSchema);

module.exports = ChatUser;
