const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Adding a reference to the User model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the name of your user model
        required: false
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const 
// Subscription = mongoose.model('Subscription', subscriptionSchema);

// module.exports = Subscription;
