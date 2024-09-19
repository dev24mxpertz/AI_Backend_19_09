const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.sendmail = async function (req, user) {
  try {
    // Generate an OTP using otp-generator
    const otp = await otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Set OTP and expiration on user model
    const otpExpirationTime = 300000; // 5 minutes in milliseconds
    console.log(otp)
    user.otp = otp;
    user.otpExpires = Date.now() + otpExpirationTime;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dushyantshrivas25@gmail.com",
        pass: "xakr gxxs qjyy wqnp",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: user.email,
      subject: "OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to:", user.email);
  } catch (error) {
    console.error("OTP Send Error:", error);
    throw error;
  }
};

exports.sendSignupConfirmation = async function (email, username) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dushyantshrivas25@gmail.com",
        pass: "xakr gxxs qjyy wqnp",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Welcome to Our Company",
      text: `Hello ${username},\n\nWelcome to our company. We are excited to have you on board.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Signup confirmation email sent to:", email);
  } catch (error) {
    console.error("Signup Confirmation Email Error:", error);
    throw error;
  }
};

exports.sendUserCredentials = async function (email, password) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dushyantshrivas25@gmail.com",
        pass: "xakr gxxs qjyy wqnp",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your Account Details",
      html: `
                <p>Your account details:</p>
                <ul>
                    <li>Email: ${email}</li>
                    <li>Password: ${password}</li>
                </ul>
                <p>Please keep this information secure.</p>
                <p>Click <a href="http://localhost:3001/signin">here</a> to login.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Account details email sent to:", email);
  } catch (error) {
    console.error("Account Details Email Error:", error);
    throw error;
  }
};
