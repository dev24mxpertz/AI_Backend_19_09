// otpModel.js

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
