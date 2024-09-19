const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  data: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true
  }
});

const QuestionAnswer = mongoose.model('QuestionAnswer', questionAnswerSchema);

module.exports = QuestionAnswer;
