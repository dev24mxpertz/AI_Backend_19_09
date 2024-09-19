const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId:{
        type: String,
    },
    senderId:{
        type: String,
    },
    message:{
        type: String,
    },
    file: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;