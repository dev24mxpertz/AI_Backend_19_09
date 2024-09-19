const mongoose = require('mongoose');

const chatbotProfileUserModel = new mongoose.Schema({

  Avatar: {
    type: String,
    default: " "
  },
  company_name: {
    type: String
  },
 
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    // required: true 
  }
});

const ChatBotProfile = mongoose.model("ChatBotProfile", chatbotProfileUserModel);

module.exports = ChatBotProfile;
