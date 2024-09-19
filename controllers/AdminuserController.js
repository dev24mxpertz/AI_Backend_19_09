const sendToken = require("../helper/sendToken");
const Adminuser = require("../models/AdminuserModel");
const UsersbyAdmin = require("../models/usersbyadminModel");
const { sendUserCredentials } = require("../utils/mail");
const { signup } = require("./indexController");
const UserModel = require('../models/userModel');


// exports.add_userby_admin = async (req, res) => {
//     console.log("Request Body:", req.body);
//     const { username, email, password, role } = req.body;

//     try {
//         // Check if a user with the same email already exists
//         const existingUser = await UserModel.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ error: "User already exists" });
//         }

//         // Set the default role to 'employee' if not provided
//         const userRole = role || 'employee';

//         // Create a new user
//         const newUser = new UserModel({
//             username,
//             password,
//             email,
//             role: userRole,
//             createdBy: req.user.id, // Store the ID of the currently logged-in user
//         });

//         // Save the new user to the database
//         await newUser.save();

//         // Log the new user with their role
//         console.log("New user created:", newUser, "User Role:", newUser.role);

//         // Send user credentials to the user's email
//         await sendUserCredentials(email, password);

//         // Send response indicating success
//         res.status(200).json({ message: "User added successfully.", userId: newUser._id });
//     } catch (error) {
//         // Handle the error without sending another response
//         console.error("Error adding user:", error);
//         res.status(400).json({ error: error.message });
//     }
// };

exports.add_userby_admin = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("req.user", req.user);
    const { username, email, password, role } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message:"Email already exists" });
        }

        // Set the default role to 'employee' if not provided
        const userRole = role || 'employee';

        let createdBy;
        if (req.user && req.user.id) {
            // If the user is authenticated and their ID is available, assign it as the creator
            createdBy = req.user.id;
        } else {
            // If the user ID is not available (e.g., if authentication fails), handle it accordingly
            return res.status(401).json({ error: "Authentication failed or user ID missing" });
        }


        console.log(createdBy)
        // Create a new user with the provided details and the creator's ID
        const newUser = new UserModel({
          username,
          password,
          email,
          role: userRole,
          createdBy: createdBy,
        });

        // Save the new user to the database
        await newUser.save();

        // Log the new user with their role
        console.log("New user created:", newUser, "User Role:", newUser.role);

        // Send user credentials to the user's email (if required)

        // Send response indicating success
        return res.status(200).json({ message: "User added successfully.", userId: newUser._id, createdBy: createdBy });
    } catch (error) {
        // Handle the error without sending another response
        console.error("Error adding user:", error);
        res.status(400).json({ error: error.message });
    }
};





// exports.add_userby_admin = async (req, res) => {
//     console.log("Request Body:", req.body);
//     const { username, email, password, role } = req.body;

//     try {
//         // Call the signup function with appropriate parameters to create the user
//         const newUser = await signup({
//             user: {
//                 id: 'admin_id', // Provide the admin user ID here
//             },
//         }, res);

//         // After successfully saving the user in UserModel,
//         // create a new instance of usersbyadmin model and save it
//         const newUserByAdmin = new UsersbyAdmin({
//             username,
//             email,
//             password,
//             role,
//             createdBy: req.user.id,
//         },);
//         await newUserByAdmin.save();

//         // Send user credentials to the user's email
//         await sendUserCredentials(email, password);

//         // No need to send response here
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };

//  exports.add_userby_admin = async (req, res) => {
//     console.log("Request Body:", req.body);
//     const { username, email, password, role } = req.body;

//     try {
//         // Call the signup function with appropriate parameters to create the user
//         const newUser = await signup({
//             body: {
//                 username,
//                 email,
//                 password,
//                 role,
//                 confirmPassword: password, // Password confirmation is not needed for admin-added users
//             },
//             // Pass the admin user ID as createdBy
//             createdBy: req.params.adminId,
//         });

//         // Send user credentials to the user's email
//         await sendUserCredentials(email, password);

//         // You can send a success response if needed
//         res.status(200).json({ message: "User added successfully." });
//     } catch (error) {
//         // Handle the error without sending another response
//         console.error("Error adding user:", error);
//         // Check if the error object has a 'status' property before accessing it
//         const status = error.status || 500;
//         const errorMessage = error.message || "Internal Server Error";
//         res.status(status).json({ error: errorMessage });
//     }
// };




exports.get_userby_admin = async (req, res) => {
    const { adminId } = req.params;

    try {
        // Find the admin user by ID
        const adminUser = await UserModel.findById(adminId);

        if (!adminUser) {
            return res.status(404).json({ error: "Admin user not found" });
        }

        // Find all users associated with the admin
        const users = await UserModel.find({ createdBy: adminId });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.update_userby_admin = async (req, res) => {
    const { adminId, userId } = req.params;
    const { username, email, role } = req.body;

    try {
        // Log for debugging - consider removing for production
        console.log("Updating user ID:", userId);

        // Check if the admin user exists
        const adminUser = await UserModel.findById(adminId);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Find the user document by its _id
        let userDocument = await UsersbyAdmin.findById(userId);
        if (!userDocument) {
            return res.status(404).json({ message: 'User document not found' });
        }

        // Update the user document properties
        if (username) userDocument.username = username;
        if (email) userDocument.email = email;
        if (role) userDocument.role = role;

        // Save the updated user document
        userDocument = await userDocument.save();

        res.status(200).json({ message: 'User updated successfully', user: userDocument });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};


// Assuming you have defined your route and imported the necessary models
exports.delete_userby_admin = async (req, res) => {
    const { adminId, userId } = req.params;

    try {
        // Check if the admin user exists
        const adminUser = await UserModel.findById(adminId);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Find the user document by its _id
        let userDocument = await UserModel.findById(userId);
        if (!userDocument) {
            return res.status(404).json({ message: 'User document not found' });
        }

        // Delete the user document
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};



exports.define_role = async (req, res) => {
    const { role } = req.body;
    const userId = req.params.userId;

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Only admin is allowed to define user roles" });
    }

    try {
        const user = await Adminuser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: "User role defined successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
