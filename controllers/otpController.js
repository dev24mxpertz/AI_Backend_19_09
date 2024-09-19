// otpController.js

const OTP = require('../models/otpModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.SENDER_EMAIL
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email) {
    const otp = generateOTP();

    try {
        await OTP.create({ email, otp });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Your One-Time Password (OTP)',
            text: `Your OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        return otp;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Error sending OTP');
    }
}

module.exports = { sendOTP };
