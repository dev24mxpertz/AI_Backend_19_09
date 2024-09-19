require("dotenv").config();
var express = require("express");
const app = express();
var router = express.Router();
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendToken = require("../helper/sendToken");
const tokenBlacklist = require("../models/tokenBlackListModel");
const indexController = require("../controllers/indexController");
const notificationController = require("../controllers/notificationController");
const chatController = require("../controllers/chatController");
const employeeController = require("../controllers/employeeController");
const subscriptionController = require("../controllers/subscriptionController");
const getintouchcontroller = require("../controllers/getinTouchController");
const AdminuserController = require("../controllers/AdminuserController");
const companyController = require("../controllers/companyController");
const multer = require("multer");
// const upload = multer({ dest: 'uploads/' });
const Adminuser = require("../models/AdminuserModel");
const otpController = require("../controllers/otpController");
const imageController = require("../controllers/imageController");
const getImage = require("../controllers/imageController");
const QuestionAnswer = require("../models/QandAModel");
const Conversations = require("../models/Conversations");
const Users = require("../models/userModel");
const Messages = require("../models/Messages");
// const { MessagingResponse } = require('twilio').twiml;
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const ChatUser = require("../models/chatuser");

// const storage = multer.memoryStorage();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const axios = require("axios");

// function isValidEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// const cheerio = require('cheerio');
// const userId = "66601a4bb66da9b2a3f7d4a6";
// const userStates = {};

// const companyName = "Mxpertz";
// const companyWebsite = "https://mxpertz.com/";

// router.post('/whatsapp', async (req, res) => {
//   console.log('Received request:', req.body);

//   const body = req.body.Body;
//   const platform = req.body.platform || 'twilio';
//   const responseMessage = new MessagingResponse();

//   if (!body) {
//     console.log('No body in the request');
//     return res.status(400).send('Bad Request: Body field is missing in the request.');
//   }

//   try {
//     const openai = new OpenAI();
//     const companyName = 'Mxpertz';
//     const companyWebsite = 'https://mxpertz.com';
//     const searchQuery = `${companyName} ${body}`;
//     const googleApiKey = 'AIzaSyD8MBoyWqKpq1aMSLKc3AdGTqIgpM_VKeE';
//     const googleCx = '96093052647204f14';
//     const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&key=${googleApiKey}&cx=${googleCx}`;

//     console.log('Google Search URL:', googleSearchUrl);

//     const googleResponse = await axios.get(googleSearchUrl);

//     if (!googleResponse.data.items || googleResponse.data.items.length === 0) {
//       throw new Error("No search results found.");
//     }

//     const searchResults = googleResponse.data.items.map(item => item.snippet).join('\n');
//     console.log('Search Results:', searchResults);

//     const question = {
//       model: "gpt-4", // Use the updated model
//       messages: [
//         {
//           role: "system",
//           content: `Please format the following information about ${companyName} and its website ${companyWebsite}:`,
//         },
//         {
//           role: "user",
//           content: searchResults,
//         },
//       ],
//       max_tokens: 500,
//     };

//     // const openAiApiKey = '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';
//     const openAiApiKey =
//       "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";

// async function getResponse() {
//   const maxRetries = 3; // Set the maximum number of retries
//   let attempt = 0;

//   while (attempt < maxRetries) {
//     try {
//       const openAiResponse = await axios.post(
//         "https://api.openai.com/v1/chat/completions", // Updated endpoint for chat-based API
//         question,
//         {
//           headers: {
//             Authorization: `Bearer ${openAiApiKey}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log(openAiResponse.data, "openAiResponse---------------------");

//       const formattedResponse =
//         openAiResponse.data.choices[0].message.content.trim();
//       console.log("Formatted Response:", formattedResponse);

//       return formattedResponse;
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         console.log(
//           `Rate limit exceeded, retrying... (${attempt + 1}/${maxRetries})`
//         );
//         attempt++;
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
//       } else {
//         console.error("Error fetching response:", error);
//         break;
//       }
//     }
//   }

//   throw new Error("Max retries exceeded");
// }

//   let formattedResponse =  getResponse();

//     // const openAiResponse = await axios.post(
//     //   'https://api.openai.com/v1/completions',
//     //   question,
//     //   {
//     //     headers: {
//     //       'Authorization': `Bearer ${openAiApiKey}`,
//     //       'Content-Type': 'application/json'
//     //     }
//     //   }
//     // );

//     // console.log(openAiResponse, "openAiResponse---------------------");

//     // const formattedResponse = openAiResponse.data.choices[0].text.trim();
//     // console.log('Formatted Response:', formattedResponse);

//     //  const openAiResponse = await axios.post(
//     //    "https://api.openai.com/v1/chat/completions", // Updated endpoint for chat-based API
//     //    question,
//     //    {
//     //      headers: {
//     //        Authorization: `Bearer ${openAiApiKey}`,
//     //        "Content-Type": "application/json",
//     //      },
//     //    }
//     //  );

//     //  console.log(openAiResponse.data, "openAiResponse---------------------");

//     //  const formattedResponse =
//     //    openAiResponse.data.choices[0].message.content.trim();
//     //  console.log("Formatted Response:", formattedResponse);

//     if (platform === 'twilio') {
//       responseMessage.message(formattedResponse);
//       res.set('Content-Type', 'text/xml');
//       res.send(responseMessage.toString());
//     } else {
//       res.send(formattedResponse);
//     }
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//     const errorMessage =      "An error occurred while processing your request.";
//     if (platform === 'twilio') {
//       responseMessage.message(errorMessage);
//       res.set('Content-Type', 'text/xml');
//       res.send(responseMessage.toString());
//     } else {
//       res.send(errorMessage);
//     }
//   }
// });

router.post("/whatsapp", async (req, res) => {
  const OpenAI = require("openai");
  const openai = new OpenAI({
    organization: "org-tpQ6abFKGMYfmKG5kfgceWo8",
    // project: "proj_H5MYfMnmA9Xl6djA3hi3Eq0s",
    apiKey:
      "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",
  });

  console.log("Received request:", req.body);

  const body = req.body.Body;
  const platform = req.body.platform || "twilio";
  const responseMessage = new MessagingResponse();

  if (!body) {
    console.log("No body in the request");
    return res
      .status(400)
      .send("Bad Request: Body field is missing in the request.");
  }

  try {
    // const companyName = "Mxpertz";
    // const companyWebsite = "https://mxpertz.com";
    // const companyName = "Amazon";
    // const companyWebsite = "https://www.amazon.in";
    // const searchQuery = `${companyName} ${body}`;

    const searchQuery = `${body}`;
    const googleApiKey = "AIzaSyD8MBoyWqKpq1aMSLKc3AdGTqIgpM_VKeE";
    // AIzaSyD8MBoyWqKpq1aMSLKc3AdGTqIgpM_VKeE;
    // const googleCx = "96093052647204f14";
    // 72dc87eb6da424029
    const googleCx = "72dc87eb6da424029";
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      searchQuery
    )}&key=${googleApiKey}&cx=${googleCx}`;

    console.log("Google Search URL:", googleSearchUrl);

    let googleResponse;
    try {
      googleResponse = await axios.get(googleSearchUrl);
    } catch (error) {
      console.error("Error during Google API request:", error);
      throw new Error("Failed to fetch search results from Google.");
    }

    if (!googleResponse.data.items || googleResponse.data.items.length === 0) {
      throw new Error("No search results found.");
    }

    const searchResults = googleResponse.data.items
      .map((item) => item.snippet)
      .join("\n");
    console.log("Search Results:", searchResults);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Please format the following information and only give related information in brief with the related company details  :`,
            // about ${companyName} and its website ${companyWebsite}
          },
          {
            role: "user",
            content: searchResults,
          },
        ],
        model: "gpt-4o-mini",
      });

      console.log(completion.choices[0].message.content);
      const Finalresponse = completion.choices[0].message.content;
      console.log(Finalresponse);
      return res.send(Finalresponse);
    } catch (error) {
      console.log(error);
    }

    const question = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Please format the following information about ${companyName} and its website ${companyWebsite}:`,
        },
        {
          role: "user",
          content: searchResults,
        },
      ],
      max_tokens: 500,
    };

    const openAiApiKey =
      "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";

    const getResponse = async () => {
      const maxRetries = 3;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const openAiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            question,
            {
              headers: {
                Authorization: `Bearer ${openAiApiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log(
            openAiResponse.data,
            "openAiResponse---------------------"
          );

          const formattedResponse =
            openAiResponse.data.choices[0].message.content.trim();
          console.log("Formatted Response:", formattedResponse);

          return formattedResponse;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.log(
              `Rate limit exceeded, retrying... (${attempt + 1}/${maxRetries})`
            );
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            console.error("Error fetching response from OpenAI:", error);
            throw error;
          }
        }
      }

      throw new Error("Max retries exceeded for OpenAI API.");
    };

    const formattedResponse = await getResponse();
    console.log(formattedResponse);

    if (platform === "twilio") {
      responseMessage.message(formattedResponse);
      res.set("Content-Type", "text/xml");
      res.send(responseMessage.toString());
    } else {
      res.send(formattedResponse);
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    const errorMessage = "An error occurred while processing your request.";
    if (platform === "twilio") {
      responseMessage.message(errorMessage);
      res.set("Content-Type", "text/xml");
      res.send(responseMessage.toString());
    } else {
      res.send(errorMessage);
    }
  }
});

router.get("/sendotp", async (req, res) => {
  const { email } = req.query;

  try {
    const otp = await otpController.sendOTP(email);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
});

router.get("/questionanswers/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Query the database to retrieve question-answer pairs for the user
    const questionAnswers = await QuestionAnswer.find({ createdBy: userId });

    // Send the question-answer pairs as the API response
    res.status(200).json(questionAnswers);
  } catch (error) {
    console.error("Failed to fetch question-answers:", error);
    res.status(500).json({
      message: "Failed to fetch question-answers",
      error: error.message,
    });
  }
});

router.put("/questionanswers/:userId/:qaId", async (req, res) => {
  const { userId, qaId } = req.params;
  const { question, answer } = req.body;

  try {
    // Find the question-answer pair by userId and qaId
    const existingQA = await QuestionAnswer.findOne({
      createdBy: userId,
      "data._id": qaId,
    });

    // If the question-answer pair exists, update it
    if (existingQA) {
      const qaIndex = existingQA.data.findIndex((qa) => qa._id == qaId);
      if (qaIndex !== -1) {
        // Check if the updated question-answer pair already exists
        const isDuplicate = existingQA.data.some(
          (qa, index) =>
            index !== qaIndex &&
            qa.question === question &&
            qa.answer === answer
        );
        if (isDuplicate) {
          return res
            .status(400)
            .json({ message: "Duplicate question-answer pair found" });
        }

        // Update the question-answer pair
        existingQA.data[qaIndex].question = question;
        existingQA.data[qaIndex].answer = answer;
        await existingQA.save();
        return res
          .status(200)
          .json({ message: "Question-answer pair updated successfully" });
      } else {
        return res
          .status(404)
          .json({ message: "Question-answer pair not found" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Question-answer pair not found" });
    }
  } catch (error) {
    console.error("Failed to update question-answer pair:", error);
    return res.status(500).json({
      message: "Failed to update question-answer pair",
      error: error.message,
    });
  }
});

router.delete("/questionanswers/:userId/:qaId", async (req, res) => {
  const { userId, qaId } = req.params;

  try {
    console.log("User ID:", userId);
    console.log("QA ID:", qaId);

    // Find the question-answer pair by user ID
    const existingQA = await QuestionAnswer.findOne({ createdBy: userId });

    if (!existingQA) {
      console.log("Question-answer pair not found");
      return res
        .status(404)
        .json({ message: "Question-answer pair not found" });
    }

    const qaIndex = existingQA.data.findIndex(
      (qa) => qa._id.toString() === qaId
    );

    if (qaIndex === -1) {
      console.log("Question-answer pair not found");
      return res
        .status(404)
        .json({ message: "Question-answer pair not found" });
    }

    existingQA.data.splice(qaIndex, 1);

    await existingQA.save();

    console.log("Question-answer pair deleted successfully");
    res
      .status(200)
      .json({ message: "Question-answer pair deleted successfully" });
  } catch (error) {
    console.error("Failed to delete question-answer pair:", error);
    res.status(500).json({
      message: "Failed to delete question-answer pair",
      error: error.message,
    });
  }
});

router.post(
  "/api/image/upload/:user_id",
  upload.single("image"),
  indexController.uploadImage
);

/* GET home page. */
// router.get("/", function (req, res, next) {
//   // console.log("------------------HOME PAGE RENDERS-----------")
//   // res.render("index");
//   // res.send({title:"index"})
//   //  { title: "Express askjdsjdhjshdjshdjshdjhjhjhjhj" }

//    res.send("<h1> Hello, World! </h1>");


// });

//Login Middleware//
const isLoggedIn = (req, res, next) => {
  console.log("Authorization Header:", req.cookies.token);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Token missing." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Invalid token." });
  }
};

const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the same secret key used to sign the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Add the user's ID (decoded from the token) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.post("/signup", indexController.signup);

router.post("/login", indexController.login);

router.get("/get_user/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    let user = await UserModel.findById(id); // Find the user by ID in UserModel

    if (!user) {
      // If user is not found in UserModel, try to find in AdminuserModel
      user = await Adminuser.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // If no user is found, return a 404 response
      }
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      Other: user.Other,
      user_Address: user.user_Address,
      user_Type: user.user_Type,
      phone: user.phone,
    };

    return res.status(200).json(userData); // Return the user data
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the user data" });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const allUsers = await AlluserController.getAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/update_user/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const { username, email, phone, user_Address, user_Type, Other } = req.body;

  try {
    // Find the user by ID
    let updatedUser = await UserModel.findById(id);

    // If user not found, return a 404 response
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user document fields if provided in the request body
    if (username !== undefined) {
      updatedUser.username = username;
    }
    if (email !== undefined) {
      updatedUser.email = email;
    }
    if (phone !== undefined) {
      updatedUser.phone = phone;
    }
    if (user_Address !== undefined) {
      updatedUser.user_Address = user_Address;
    }
    if (user_Type !== undefined) {
      updatedUser.user_Type = user_Type;
    }
    if (Other !== undefined) {
      updatedUser.Other = Other;
    }

    // Save the updated user document
    updatedUser = await updatedUser.save();

    // Return a success message along with the updated user document
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);

    // Return a 500 status code along with the error message
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

router.post("/delete_user/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await UserModel.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // If the password is correct, proceed to delete the user
    await UserModel.findByIdAndDelete(id);

    // Optionally, clear up any related data that the user might have created

    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

router.post(
  "/add_employee/:userId",
  isLoggedIn,
  employeeController.addEmployee
);

router.get("/get_employee/:userId", isLoggedIn, employeeController.getEmployee);

router.post(
  "/update_employee/:employeeId",
  isLoggedIn,
  employeeController.updateEmployee
);

router.post(
  "/delete_employee/:id",
  isLoggedIn,
  employeeController.deleteEmployee
);

router.post("/forgot_password", indexController.forgot_password);

router.post(
  "/change_password",
  authenticateUser,
  indexController.change_password
);

router.post("/reset_password/verify_otp", indexController.reset_password);

router.post("/logout", async (req, res) => {
  // Check if the Authorization header is provided
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  // Extract the token from the Authorization header
  const tokenParts = req.headers.authorization.split(" ");

  // Check if the Authorization header is correctly formatted as 'Bearer token'
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(400).json({
      error: 'Bad authorization header format. Format is "Bearer <token>".',
    });
  }

  const token = tokenParts[1];

  // Add the token to the blacklist
  try {
    await tokenBlacklist.create({ token });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Something went wrong during logout" });
  }
});

router.get("/getallusers", isLoggedIn, indexController.getAllUsers);

router.get(
  "/get_notification/:userId",
  isLoggedIn,
  notificationController.getNotifications
);

router.post(
  "/create_notification/:userId",
  isLoggedIn,
  notificationController.createNotification
);

router.delete(
  "/delete_notification/:userId/:notificationId",
  isLoggedIn,
  notificationController.deleteNotification
);

router.post("/message", chatController.message);

router.post("/subscribe", subscriptionController.subscribe);

router.get("/getsubscriptions", subscriptionController.getSubscriptions);

router.post("/getinTouch", getintouchcontroller.getinTouch);

router.get(
  "/get_userby_admin/:adminId",
  isLoggedIn,
  AdminuserController.get_userby_admin
);

router.post(
  "/add_userby_admin",
  isLoggedIn,
  AdminuserController.add_userby_admin
);

router.post(
  "/update_userby_admin/:adminId/:userId",
  isLoggedIn,
  AdminuserController.update_userby_admin
);

router.post(
  "/delete_userby_admin/:adminId/:userId",
  isLoggedIn,
  AdminuserController.delete_userby_admin
);

router.put("/define_role/:userId", isLoggedIn, AdminuserController.define_role);

router.post("/company", isLoggedIn, companyController.company);

router.get("/get_company/:userId", isLoggedIn, companyController.get_company);

router.post("/update_company", isLoggedIn, companyController.update_company);

router.patch(
  "/notification/read/:notificationId",
  notificationController.notificationread
);

router.post(
  "/chatbotprofile/:userId",
  upload.single("Avatar"),
  isLoggedIn,
  chatController.chatprofile
);

router.put(
  "/updateChatProfile/:id",
  isLoggedIn,
  chatController.updateChatProfile
);

router.get(
  "/getchatprofile/:userId",
  isLoggedIn,
  chatController.getchatprofile
);

router.post(
  "/questionanswer/:userId",
  isLoggedIn,
  chatController.questionanswer
);

router.get("/search/:userId", chatController.searchQuestion);

router.put(
  "/update/:pairId",
  isLoggedIn,
  chatController.updateQuestionAnswerPair
);

router.post("/getanswer", isLoggedIn, chatController.getanswer);

router.get("/getQandA", isLoggedIn, chatController.getQandA);

router.get("/getallQandA", isLoggedIn, chatController.getAllQandA);

router.post("/updateQandA/:id", isLoggedIn, chatController.updateQandA);

router.post("/deleteQandA/:id", isLoggedIn, chatController.deleteQandA);

router.post("/deleteallQandA", isLoggedIn, chatController.deleteAllQandA);

router.post(
  "/botsaveUserDetails",
  isLoggedIn,
  chatController.botsaveUserDetails
);

router.post("/deletechatuser/:id", isLoggedIn, chatController.deletechatuser);

router.post(
  "/image/upload",
  upload.single("image"),
  imageController.uploadImage
);

router.get("/image/:userId", imageController.getImage);

router.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error, "Error");
  }
});

const mongoose = require("mongoose");

router.get("/api/conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    const conversationUserData = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );

        if (!receiverId) {
          return null; // No valid receiverId found, skip this conversation
        }

        const user = await Users.findById(receiverId);

        if (!user) {
          return null; // User not found, skip this conversation
        }

        return {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
          },
          conversationId: conversation._id,
        };
      })
    );

    // Filter out any null results
    const validConversationUserData = conversationUserData.filter(
      (data) => data !== null
    );

    res.status(200).send(validConversationUserData);
  } catch (error) {
    console.error(error, "Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads'); // Destination folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     // Generate unique filename for each uploaded file
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// const multer = require('multer');
// const upload = multer({ storage: storage });

// POST route to handle message and file upload

router.post("/api/message", upload.single("file"), async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    const file = req.file;

    console.log("Incoming request data:", {
      conversationId,
      senderId,
      message,
      receiverId,
      file: file ? file.path : null,
    });

    if (!senderId || !message) {
      return res.status(400).send("Please fill all required fields");
    }

    // Save the message in a separate Messages document
    const newMessage = new Messages({
      conversationId,
      senderId,
      message,
      file: file ? file.path : null, // Store the file path if file is uploaded
    });

    await newMessage.save();

    res.status(200).send("Message and file (if any) sent successfully");
  } catch (error) {
    console.error("Error saving message and file to the database:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    console.log(conversationId, senderId, message, receiverId);
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");

    // Check if the conversationId is 'new' or not provided
    if (conversationId === "new" || !conversationId) {
      // Check if a conversation already exists between senderId and receiverId
      let existingConversation = await Conversations.findOne({
        members: { $all: [senderId, receiverId] },
      });

      // If no conversation exists, create a new one
      if (!existingConversation) {
        existingConversation = new Conversations({
          members: [senderId, receiverId],
        });
        await existingConversation.save();
      }

      // Save the message in the existing or new conversation
      const newMessage = new Messages({
        conversationId: existingConversation._id,
        senderId,
        message,
      });
      await newMessage.save();

      return res.status(200).send("Message sent successfully");
    }

    // If conversationId is provided, save the message in the specified conversation
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error, "Error");
    res.status(500).send("Internal server error");
  }
});

router.get("/api/message/:conversationId", async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      const messageUserData = await Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          if (user) {
            return {
              user: {
                id: message.senderId,
                email: user.email,
                username: user.username,
              },
              message: message.message,
            };
          } else {
            // Handle case where user is not found
            return {
              user: {
                id: message.senderId,
                email: "Unknown",
                username: "Unknown",
              },
              message: message.message,
            };
          }
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log(error, "Error");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/message/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });

    if (!messages) {
      return res.status(404).json({ error: "Messages not found" });
    }

    // Separate messages and files
    const messageData = [];
    const fileData = [];

    await Promise.all(
      messages.map(async (message) => {
        const user = await Users.findById(message.senderId);
        if (!user) {
          messageData.push({
            user: {
              id: message.senderId,
              email: "Unknown",
              username: "Unknown",
            },
            message: message.message,
          });
        } else {
          messageData.push({
            user: {
              id: message.senderId,
              email: user.email,
              username: user.username,
            },
            message: message.message,
          });
        }

        if (message.file) {
          fileData.push({
            fileName: message.file,
            // Include other file-related information if needed
          });
        }
      })
    );

    res.status(200).json({ messages: messageData, files: fileData });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/chatuser", async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: { email: user.email, username: user.username },
          userId: user._id,
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
});

module.exports = router;
