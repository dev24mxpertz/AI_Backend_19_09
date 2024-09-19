const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getInTouchSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the name of your user model
        required: false
    },
    name: { type: String, required: false },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    companySize:{type:Number , required:true},
    Industry:{type:String , required:true}
});

const GetInTouch = mongoose.model('GetInTouch', getInTouchSchema);

module.exports = GetInTouch;
