const Employee = require('../models/employeeModel');
const UserModel = require("../models/userModel");
const  Adminuser = require("../models/AdminuserModel")

// exports.addEmployee = async (req, res) => {
//   try {
//     const { Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary } = req.body;
//     const { userId } = req.params;

//     const newEmployee = new Employee({
//       Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary, user: userId
//     });

//     // Save the new employee to the database
//     const savedEmployee = await newEmployee.save();
//      let v = savedEmployee._id
//     // Update the user document to add the new employee's ID to the employees array
//     await UserModel.findByIdAndUpdate(
//       userId,
//       { $push: { employees: v } },
//       { new: true }
//     );

//     console.log('Employee added to the user');
//     // Respond with the employee details
//     res.status(201).json({
//       message: 'Employee added successfully',
//       newEmployee: savedEmployee.toObject()
//     });
//   } catch (error) {
//     console.error('Error adding employee:', error);
//     res.status(500).json({ error: 'Error adding employee' });
//   }
// };

exports.addEmployee = async (req, res) => {
  try {
    const { Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary } = req.body;
    const { userId } = req.params;

    let user = await UserModel.findById(userId);

    if (!user) {
      user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    let savedEmployee;

    if (user.role === 'admin') {
      // User is an admin, push the employee to the adminuser model
      const newEmployee = new Employee({
        Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary, user: userId
      });
      savedEmployee = await newEmployee.save();

      // Update the adminuser document to add the new employee's ID to the employees array
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { employees: savedEmployee._id } },
        { new: true }
      );
    } else {
      // User is not an admin, push the employee to the user model
      const newEmployee = new Employee({
        Name, Email_id, Phone_Number, EmployeeId, Address, Join_Date, Salary, user: userId
      });
      savedEmployee = await newEmployee.save();

      // Update the user document to add the new employee's ID to the employees array
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { employees: savedEmployee._id } },
        { new: true }
      );
    }

    console.log('Employee added to the user');
    // Respond with the employee details
    res.status(201).json({
      message: 'Employee added successfully',
      newEmployee: savedEmployee.toObject()
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Error adding employee' });
  }
};



exports.getEmployee = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await UserModel.findById(userId).populate('employees');

    if (!user || !user.employees || user.employees.length === 0) {
      // If no employees found in UserModel, try finding them in AdminuserModel
      user = await Adminuser.findById(userId).populate('employees');
    }

    if (!user || !user.employees || user.employees.length === 0) {
      // If no employees found in AdminuserModel as well, return "Employee not found"
      return res.status(404).json({ message: "Employee not found" });
    }

    // Respond with the user object
    res.status(200).json({ message: "User found", employees: user.employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { Name, Email_id, Phone_Number, EmployeeId: newEmployeeId, Address, Join_Date, Salary} = req.body; // Assuming these are the fields you want to update.
    const employeeId = req.params.employeeId; // Extract the employeeId from the URL parameter.

    let employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee with new values. If you're using EmployeeId from the body to potentially update it, make sure it's a valid operation in your application logic.
    Object.assign(employee, { Name, Email_id, Phone_Number, EmployeeId: newEmployeeId || employee.EmployeeId, Address, Join_Date, Salary });
    await employee.save();

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 



exports.deleteEmployee = async (req, res) => {
  try {
    const { userId } = req.params;
    const employeeId = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await UserModel.findByIdAndUpdate(userId, { $pull: { employees: employeeId } });

    res.status(200).json({ message: "Employee deleted successfully", employeeId: deletedEmployee.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
