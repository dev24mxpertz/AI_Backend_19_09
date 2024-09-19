const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = mongoose.Schema({
    Name: {
        type: String,
    },
    profileImageUrl:{ 
        type: String,
        default: 'https://ik.imagekit.io/dev19/dummy_3sVZJM0jt.png'
    },
    Email_id: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adminuser: {
        type: Schema.Types.ObjectId,
        ref: 'Adminuser',
        default: null
    },
    Phone_Number: {
        type:Number,
    },
    EmployeeId:{
        type:String,
        unique:true
    },
    Address: {
        type:String,
    },
    Join_Date: 
        {
            type: Date, 
        },
    Salary: 
        {
            type: String,    
        },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
