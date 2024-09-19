
const chatprofile = require("../models/chatBotProfileModel")
const questionanswer = require('../models/QandAModel')
const botuserdetail = require("../models/botuserdetailModel")
const UserModel = require("../models/userModel")
const QuestionAnswer = require("../models/QandAModel")

exports.message = async (req,res)=>{
  const { message } = req.body;
  const response = await manager.process('en', message);
  res.send({ response: response.answer });
}

exports.chatprofile = async (req, res) => {
  const { company_name } = req.body;
  const userId = req.user.id; // Get user ID from the authenticated user

  try {
      // Check if a chat profile for the given user ID already exists
      const existingProfile = await chatprofile.findOne({ userId });

      if (existingProfile) {
          return res.status(400).json({ message: 'A chat bot profile for this user already exists' });
      }

      let Avatar = '';
      if (req.file) {
          Avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
          // In a real scenario, you'd upload to your cloud storage and get the URL
      }

      // Create a new chat profile with the user ID
      const newBotProfile = new chatprofile({ 
          Avatar, 
          company_name,
          createdby:req.user.id
  
      });
      await newBotProfile.save();

      return res.json({ message: 'Chat bot profile added', newBotProfile });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to add chat bot profile', error });
  }
};

// Update chat profile
exports.updateChatProfile = async (req, res) => {
  const { company_name } = req.body;
  let Avatar = '';
  if (req.file) {
      Avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      // In a real scenario, upload to your cloud storage and get the URL
  }
  try {
      // Find the chat profile to update based on _id
      const existingChatProfile = await chatprofile.findOne({ _id: req.params.id });

      if (!existingChatProfile) {
          return res.status(404).json({ message: 'Chat bot profile not found' });
      }

      // Check if the chat profile belongs to the logged-in user
      if (existingChatProfile.createdby.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized' });
      }

      // Update the chat profile details
      existingChatProfile.company_name = company_name;
      if (Avatar) { // Only update Avatar if a new file was uploaded
          existingChatProfile.Avatar = Avatar;
      }
      await existingChatProfile.save();

      return res.json({ message: 'Chat bot profile updated', updatedBotProfile: existingChatProfile });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update chat bot profile', error });
  }
};

exports.getchatprofile = async (req, res) => {
  const userId = req.user.id; // Use the user ID of the logged-in user

  try {
    // Assuming your chatprofile model has a userId field to link profiles to users
    const profile = await chatprofile.findOne({ createdby: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Chatbot profile not found for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch chatbot profile', error: error });
  }
};

exports.questionanswer = async (req, res) => {
  const { data } = req.body;
  const { userId } = req.params;
  console.log(userId);

  try {
    // Check if the data already exists for the user
    let existingData = await QuestionAnswer.findOne({ createdBy: userId });

    // If data exists, update it by appending new question-answer pairs; otherwise, create new data
    if (existingData) {
      for (const { question, answer } of data) {
        // Check if the question already exists in the existing data
        const existingQuestionIndex = existingData.data.findIndex(qa => qa.question === question);
        
        // If the question doesn't exist, add it to the existing data
        if (existingQuestionIndex === -1) {
          existingData.data.push({ question, answer });
        } else {
          // If the question already exists
          if (existingData.data[existingQuestionIndex].answer !== answer) {
            // If the answer is different, show a message and return
            console.log(message); 
            return res.status(400).json({ message: "Duplicate data found. Answers for existing questions cannot be updated." });
          }
        }
      }
      // Save the updated data
      await existingData.save();
    } else {
      // Create and save new question-answer pair
      const newData = new QuestionAnswer({ data, createdBy: userId });
      await newData.save();
    }
    
    res.status(201).json({ message: "Questions and answers saved successfully" });
  } catch (error) {
    console.error("Failed to save questions and answers:", error);
    res.status(500).json({ message: "Failed to save questions and answers", error: error.message });
  }
};

exports.searchQuestion = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.params;

  console.log("Query:", query);
  console.log("UserId:", userId);

  try {
    // Search for questions containing the query text and associated with the specific user
    const questions = await QuestionAnswer.find({ createdBy: userId, "data.question": { $regex: new RegExp(query, 'i') } });
    
    console.log("Questions:", questions);

    if (questions.length > 0) {
      // Sort questions based on the number of matching words
      const sortedQuestions = questions.map(question => {
        const matchingWords = question.data.reduce((count, item) => {
          const words = item.question.toLowerCase().split(' ');
          const queryWords = query.toLowerCase().split(' ');
          return count + words.filter(word => queryWords.includes(word)).length;
        }, 0);
        return { question, matchingWords };
      }).sort((a, b) => b.matchingWords - a.matchingWords);

      console.log("SortedQuestions:", sortedQuestions);

      // Return the answer for the question with the highest number of matching words
      const bestMatchQuestion = sortedQuestions[0].question;
      const answer = bestMatchQuestion.data.find(item => item.question.toLowerCase().includes(query.toLowerCase())).answer;

      console.log("BestMatchQuestion:", bestMatchQuestion);
      console.log("Answer:", answer);

      res.status(200).json({ question: bestMatchQuestion.data[0].question, answer });
    } else {
      // If no matching questions are found, return a message
      console.log("No matching questions found");
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error("Failed to search question:", error);
    res.status(500).json({ message: "Failed to search question", error: error.message });
  }
};

exports.updateQuestionAnswerPair = async (req, res) => {
  const { pairId } = req.params; // Extract the pairId from the request parameters
  const { question, answer } = req.body; // Extract the updated question and answer from the request body

  try {
    // Find the user's data
    let userData = await QuestionAnswer.findOne({ createdBy: userId });

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    // Find the index of the pair to be updated
    const pairIndex = userData.data.findIndex(pair => pair._id === pairId);

    if (pairIndex === -1) {
      return res.status(404).json({ message: "Question-answer pair not found" });
    }

    // Update the question and answer
    userData.data[pairIndex].question = question;
    userData.data[pairIndex].answer = answer;

    // Save the updated data
    await userData.save();

    res.status(200).json({ message: "Question-answer pair updated successfully" });
  } catch (error) {
    console.error("Failed to update question-answer pair:", error);
    res.status(500).json({ message: "Failed to update question-answer pair", error: error.message });
  }
};


exports.getanswer = async (req, res) => {
  let { question } = req.body;
  question = question.trim().toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

  const userId = req.user.id; // Assuming the user ID is stored in req.user.id

  try {
    // Find all answers for the user with the given user ID
    const regex = new RegExp("^" + question + "$", "i");
    const qaPairs = await questionanswer.find({
      question: regex,
      createdby: userId
    }).exec();

    if (qaPairs.length > 0) {
      const answers = qaPairs.map(qaPair => qaPair.answer);
      res.json({ success: true, answers });
    } else {
      res.json({ success: false, message: "No answers found for this user" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllQandA = async (req, res) => {
  try {
      const allQandA = await questionanswer.find({}); // Find all documents in the collection
      res.status(200).json(allQandA); // Send back the data
  } catch (error) {
      console.error("Failed to retrieve questions and answers:", error);
      res.status(500).json({ message: "Failed to retrieve questions and answers", error: error });
  }
};

exports.getQandA = async (req, res) => {
  const userId = req.params.userId; 

  try {
      const qandas = await questionanswer.find({ createdby: userId });
      if (!qandas) {
          return res.status(404).json({ message: "No questions and answers found for the given user." });
      }
      res.json(qandas);
  } catch (error) {
      console.error("Error fetching questions and answers:", error);
      res.status(500).json({ message: "Error fetching questions and answers", error: error.message });
  }
};

// API endpoint to delete a specific Q&A entry
exports.deleteQandA = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
      const deletedQandA = await questionanswer.findByIdAndDelete(id); // Find and delete the Q&A entry
      if (!deletedQandA) {
          return res.status(404).json({ message: "Q&A entry not found" });
      }
      res.status(200).json({ message: "Q&A entry deleted successfully", deletedQandA });
  } catch (error) {
      console.error("Failed to delete Q&A entry:", error);
      res.status(500).json({ message: "Failed to delete Q&A entry", error: error });
  }
};

exports.deleteAllQandA = async (req, res) => {
  try {
      await questionanswer.deleteMany({}); // Delete all documents
      res.status(200).json({ message: "All Q&A entries deleted successfully" });
  } catch (error) {
      console.error("Failed to delete all Q&A entries:", error);
      res.status(500).json({ message: "Failed to delete all Q&A entries", error: error });
  }
};

exports.updateQandA = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
      const updatedQandA = await questionanswer.findByIdAndUpdate(id, { question, answer }, { new: true });
      if (!updatedQandA) {
          return res.status(404).json({ message: "Q&A entry not found" });
      }
      res.status(200).json({ message: "Q&A entry updated successfully", updatedQandA });
  } catch (error) {
      console.error("Failed to update Q&A entry:", error);
      res.status(500).json({ message: "Failed to update Q&A entry", error: error });
  }
};

exports.botsaveUserDetails=async (req, res) => {
  try {
      // Create a new document using the provided user details
      const newUser = new botuserdetail({
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber
      })

      // Save the new user document to the database
      await newUser.save();

      // Send a success response
      res.status(200).json({ message: 'User details saved successfully' });
  } catch (error) {
      console.error('Error saving user details:', error);
      // Send an error response
      res.status(500).json({ message: 'Failed to save user details' });
  }
};


exports.deletechatuser = async (req, res) => {
  const userId = req.params.id;
  
  try {
      // Find the user by ID and delete it
      const deletedUser = await botuserdetail.findByIdAndDelete(userId);
      
      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
};