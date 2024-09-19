const subscription = require("../models/subscriptionModel");


// exports.subscribe = async (req, res) => {
//     const { email } = req.body;
//     if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//     }

//     try {
//         const userId = email; // Assuming req.user.id contains the user's ID
//         const newSubscription = new subscription({ email, userId });
//         await newSubscription.save();
//         res.json({ message: "Subscription successful" });
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(400).json({ error: 'Email is already subscribed' });
//         }
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while subscribing' });
//     }
// }

// exports.subscribe = async (req, res) => {
//     try {
//       const { email } = req.body;
  
//       // Check if email already exists
//       const existingSubscription = await subscription.findOne({ email });
//       if (existingSubscription) {
//         return res.status(400).json({ error: 'Email already subscribed' });
//       }
  
//       // Create new subscription
//       const subscription = new Subscription({ email });
//       await subscription.save();
  
//       res.status(201).json({ message: 'Subscription successful' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred while subscribing' });
//     }
//   };

exports.getSubscriptions = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user's ID is available in the request object
        const Subscriptions = await subscription.find({ user: userId }); // Assuming 'Subscription' is your Mongoose model and 'user' is the field that stores the user's ObjectId
        res.json(Subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching subscriptions' });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user's ID is available in the request object
        const subscriptionId = req.params.id; // The ID of the subscription to delete

        // Find the subscription by ID and ensure it belongs to the logged-in user
        const Subscription = await subscription.findOne({ _id: subscriptionId, user: userId });

        if (!Subscription) {
            return res.status(404).json({ error: "Subscription not found or does not belong to the user" });
        }

        // Delete the subscription
        await Subscription.remove();

        res.json({ message: "Subscription deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the subscription" });
    }
};

// const subscription = require('./model');
const Subscription = require("../models/subscriptionModel");

// Controller function to handle subscription
exports.subscribe = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if email already exists
      const existingSubscription = await Subscription.findOne({ email });
      if (existingSubscription) {
        return res.status(400).json({ error: 'Email already subscribed' });
      }
  
      // Create new subscription without the 'id' property
      const subscription = new Subscription({ email });
      await subscription.save();
  
      res.status(201).json({ message: 'Subscription successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while subscribing' });
    }
  };



