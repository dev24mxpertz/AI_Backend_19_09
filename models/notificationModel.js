const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }, 
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
