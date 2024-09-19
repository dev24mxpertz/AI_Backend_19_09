const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersbyadminSchema = new mongoose.Schema({
    userId: {
        type: String,
        // required: true,
        unique: true // Ensure userId is unique
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
    type:String,
    required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref: 'Adminuser',
    }
});

const UsersbyAdmin = mongoose.model('Users', usersbyadminSchema);

module.exports = UsersbyAdmin;
