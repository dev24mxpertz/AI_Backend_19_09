const mongoose = require("mongoose")

const botuserdetailschema = new mongoose.Schema({

    name:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String
    }

})

const botuserdetail = mongoose.model("botuserdetail",botuserdetailschema);
module.exports = botuserdetail;