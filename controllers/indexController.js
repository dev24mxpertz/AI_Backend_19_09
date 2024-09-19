const UserModel = require("../models/userModel")
const sendToken = require('../helper/sendToken');
const {sendmail} = require("../utils/mail");
const Company = require("../models/companyModel");
const { company } = require("./companyController");
const {sendSignupConfirmation} = require("../utils/mail")
const Adminuser = require("../models/AdminuserModel")
const ImageKit = require("imagekit");


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await UserModel.findOne({ email });

      if (!user) {
          // If user is not found in UserModel, try to find in AdminuserModel
          user = await Adminuser.findOne({ email });
      }
      console.log("User Object:", user);
      if (!user || !(await UserModel.comparePassword(password, user.password))) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const role = user.role;

      // Generate JWT token for successful login
      const token = await user.jwttoken();

      // Respond with both token and userId
      res.status(200).json({ token, userId: user._id, role , company: company });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};




// exports.signup = async (req, res) => {
//   const { username, email, password, confirmPassword } = req.body;

//   if (password !== confirmPassword) {
//       return res.status(400).send({ code: 400, message: "Passwords do not match" });
//   }

//   let role = 'user';
//   const domain = email.split('@')[1];
//   if (domain === 'admin.com') {
//       role = 'admin';
//   } else if (domain === 'manager.com') {
//       role = 'manager';
//   } else if (domain === 'employee.com') {
//       role = 'employee';
//   }

//   try {
//       let newUser;
//       let newCompany;
//       if (role === 'admin') {
//           newCompany = await Company.create({
//               Company_Name: username,
//               Company_Email: email,
//               // Add other fields if needed
//               users: [], // Initialize users array
//               adminusers: [], // Initialize adminusers array
//           });

//           console.log("New company created:", newCompany);

//           newUser = new Adminuser({
//               username,
//               password,
//               email,
//               role:req.body.role,
//               company: newCompany._id, // Add the company ID to the adminuser model
//           });

//           // Push the company ID into the adminuser model
//           newCompany.adminusers.push(newUser._id);
//           await newCompany.save();
//       } else {
//           newCompany = await Company.create({
//               Company_Name: username,
//               Company_Email: email,
//               // Add other fields if needed
//               users: [], // Initialize users array
//               adminusers: [], // Initialize adminusers array
//           });

//           console.log("New company created:", newCompany);

//           newUser = new UserModel({
//               username,
//               password,
//               email,
//               role:req.body.role,
//               company: newCompany._id, // Add the company ID to the user model
//           });

//           // Push the user ID into the company model
//           newCompany.users.push(newUser._id);
//           await newCompany.save();
//       }

//       await newUser.save();

//       console.log("New user created:", newUser);

//       await sendSignupConfirmation(email, username);
//       sendToken(newUser, res, 201);
//   } catch (err) {
//       console.error("Error during signup:", err);
//       if (err && err.code === 11000) {
//           return res.status(400).send({ code: 400, message: "User already exists" });
//       } else {
//           return res.status(500).send({ code: 500, message: "Error during signup" });
//       }
//   }
// };

// exports.signup = async (req, res) => {
//   const { username, email, password, confirmPassword, role } = req.body;

// // Check if passwords match
// if (password !== confirmPassword) {
//     return res.status(400).send({ code: 400, message: "Passwords do not match" });
// }

// // Set the default role to 'admin' if not provided
// let userRole = role || 'admin';

// try {
//     // Create a new user based on the provided role
//     let newUser;
//     let newCompany;
//     if (userRole === 'admin') {
//         // Create a new company for admin users
//         // newCompany = await Company.create({
//         //     Company_Name: username,
//         //     Company_Email: email,
//         //     users: [], // Initialize users array
//         //     adminusers: [], // Initialize adminusers array
//         // });

//         // Create a new admin user
//         newUser = new Adminuser({
//             username,
//             password,
//             email,
//             role: userRole, // Assign the user role
//             company: newCompany._id,
//         });

//         // Push the admin user ID into the adminusers array of the company
//         newCompany.adminusers.push(newUser._id);
//         await newCompany.save();
//     } else {
//         // Create a new user for non-admin roles
//         newCompany = await Company.create({
//             Company_Name: username,
//             Company_Email: email,
//             users: [], // Initialize users array
//             adminusers: [], // Initialize adminusers array
//         });

//         // Create a new regular user
//         newUser = new UserModel({
//             username,
//             password,
//             email,
//             role: userRole, // Assign the user role
//             company: newCompany._id,
//         });

//         // Push the user ID into the users array of the company
//         newCompany.users.push(newUser._id);
//         await newCompany.save();
//     }

//     // Save the new user to the database
//     await newUser.save();

//     // Log the new user with their role
//     console.log("New user created:", newUser, "User Role:", newUser.role);

//     // Send signup confirmation email
//     await sendSignupConfirmation(email, username);

//     // Send token and response
//     sendToken(newUser, res, 201);
// } catch (err) {
//     console.error("Error during signup:", err);
//     if (err && err.code === 11000) {
//         return res.status(400).send({ code: 400, message: "User already exists" });
//     } else {
//         return res.status(500).send({ code: 500, message: "Error during signup" });
//     }
// }
// };


// exports.signup = async (req, res) => {
//   const { username, email, password, confirmPassword, role } = req.body;

//   // Check if passwords match
//   if (password !== confirmPassword) {
//       return res.status(400).send({ code: 400, message: "Passwords do not match" });
//   }

//   try {
//       // Check if a user with the same email already exists
//       const existingUser = await UserModel.findOne({ email });

//       if (existingUser) {
//           return res.status(400).send({ code: 400, message: "User already has an account" });
//       }

//       // Set the default role to 'admin' if not provided
//       const userRole = role || 'admin';

//       const defaultProfileImageUrl = 'https://ik.imagekit.io/dev19/dummy_3sVZJM0jt.png';
//       // Create a new user
//       const newUser = new UserModel({
//           username,
//           password,
//           email,
//           role: userRole,
//           profileImageUrl: defaultProfileImageUrl,
//       });

//       // Save the new user to the database
//       await newUser.save();

//       // Log the new user with their role
//       console.log("New user created:", newUser, "User Role:", newUser.role);

//       // Send signup confirmation email
//       await sendSignupConfirmation(email, username);

//       // Send token and response
//       sendToken(newUser, res, 201);
//   } catch (err) {
//       console.error("Error during signup:", err);
//       return res.status(500).send({ code: 500, message: "Error during signup" });
//   }
// };
exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
      return res.status(400).send({ code: 400, message: "Passwords do not match" });
  }

  try {
      // Check if a user with the same email already exists
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
          return res.status(400).send("User already has an account" );
      }

      // Set the default role to 'admin' if not provided
      const userRole = role || 'admin';

      const defaultProfileImageUrl = 'https://ik.imagekit.io/dev19/dummy_3sVZJM0jt.png';
      // Create a new user
      const newUser = new UserModel({
          username,
          password,
          email,
          role: userRole,
          profileImageUrl: defaultProfileImageUrl,
      });

      // Save the new user to the database
      await newUser.save();

      // Log the new user with their role
      console.log("New user created:", newUser, "User Role:", newUser.role);

      // Send signup confirmation email
      await sendSignupConfirmation(email, username);
      // return res.status(201).send({ code: 201, message: "Signup successful" });
      // Send token and response
      sendToken(newUser, res, 201);
  } catch (err) {
      console.error("Error during signup:", err);
      return res.status(500).send({ code: 500, message: "Error during signup" });
  }
};








  exports.forgot_password = ( async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      await user.save();
  
      try {
        await sendmail(req, user);
        res.status(200).json({ message: "Password reset instructions sent to your email." });
      } catch (sendMailError) {
        console.error("Send mail error:", sendMailError);
        res.status(500).json({ message: "An error occurred while sending the email." });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "An error occurred while processing your request." });
    }
  });
  
  exports.change_password = ( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.user.id);
  
      // Validate the old password
      if (!user || !(await UserModel.comparePassword(oldPassword, user.password))) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
  
      user.password = newPassword;
  
      // Save the user
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  exports.reset_password=( async (req, res) => {
    const { otp, newPassword } = req.body;
  
    try {
        // Find user by OTP
        const user = await UserModel.findOne({ otp });
  
        // Check if OTP has expired
        if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP is invalid or has expired.' });
        }
  
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
         user.password = newPassword;
        user.otp = undefined; // Remove OTP
        user.otpExpires = undefined; // Remove OTP expiration date
        await user.save();
  
        res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });

  exports.getAllUsers = async (req, res) => {
    try {
        // Find all users
        const users = await UserModel.find();
        if (!users || users.length === 0){
          return res.status(404).json({message:'No users found'});
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message:'An error occurred while fetching users' });
    }
};

var imagekit = new ImageKit({
  publicKey: "public_s9UEwIJrtesNhEeT4uv0hklRmzc=",
  privateKey: "private_kP7A0uR8qBVwB4AAN35xkr/UwmU=",
  urlEndpoint: "https://ik.imagekit.io/dev19",
});

exports.uploadImage = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload image to ImageKit
    imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    }, async function (error, result) {
      if (error) {
        return res.status(500).json({ error: "An error occurred while uploading the image" });
      } else {
        const imageUrl = result.url;

        try {
          // Update the user's profile image URL in the database
          const user = await UserModel.findByIdAndUpdate(user_id, {
            profileImageUrl: imageUrl,
          }, { new: true });

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          res.status(200).json({ message: "User image updated successfully", user });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to update user image" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    console.log(req.file)

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Perform image upload to ImageKit
    // buffer nhi araha hai file ke saath bola to sahi buffer dalena bhul gay to daal do coomand  ab api sahi chalege npm buffer pata nhi sir ab sahi
    imagekit.upload(
      {
        file: req.file.buffer, // Use file buffer instead of req.file
        fileName: req.file.originalname, // Use original file name
      },
      async function (error, result) {
        if (error) {
          res
            .status(500)
            .json({ error: "An error occurred while uploading the image" });
        } else {
          console.log(result)
          const imageUrl = result.url;

          try {
            // Update the user's profile image URL in the database
            const user = await UserModel.findByIdAndUpdate(user_id, {
              profileImageUrl: imageUrl,
            }, { new: true }); // Set { new: true } to return the updated document
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }

            res
              .status(200)
              .json({ message: "User image updated successfully", user });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update user image" });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

exports.updateEmployeeImage = async (req, res) => {
  try {
      const { id } = req.params;

      // Check if a file was uploaded
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      // Perform image upload to ImageKit
      imagekit.upload(
          {
              file: req.file.buffer, // Use file buffer instead of req.file
              fileName: req.file.originalname, // Use original file name
          },
          async function (error, result) {
              if (error) {
                  res.status(500).json({ error: "An error occurred while uploading the image" });
              } else {
                  console.log(result);
                  const imageUrl = result.url;

                  try {
                      // Find the employee by ID
                      const employee = await Employee.findById(id);

                      // Check if employee exists
                      if (!employee) {
                          return res.status(404).json({ error: "Employee not found" });
                      }

                      // Update the profile image URL
                      employee.profileImageUrl = imageUrl;

                      // Save the updated employee
                      const updatedEmployee = await employee.save();

                      // Return success response with updated employee data
                      res.status(200).json({ message: "Employee image updated successfully", employee: updatedEmployee });
                  } catch (error) {
                      console.error(error);
                      res.status(500).json({ error: "Failed to update employee image" });
                  }
              }
          }
      );
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while processing the request" });
  }
};
  
  
  
  