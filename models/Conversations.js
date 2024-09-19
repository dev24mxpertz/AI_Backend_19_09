const mongoose = require('mongoose');

const conversationsSchema =mongoose.Schema({
    members:{
        type: Array,
        required: true,
    }
});

const Conversations = mongoose.model('Conversation', conversationsSchema);

module.exports = Conversations;