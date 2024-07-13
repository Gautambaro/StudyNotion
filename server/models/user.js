const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Student","Instructor"]
    },
    additionalDetails:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    active:{
      type:Boolean,
      default:true,
    },
    approved:{
     type:Boolean,
     default:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
      type:Date,
    },
    Image:{
        type:String,
    },
    courseProgress:[
        {
            type:mongoose.Types.ObjectId,
            required:true,
            ref:"courseProgress",
        }
    ],
    
},
{timestamps:true}
);
// i have left test with findOneAndUpdate
//userSchema.post('update',async function(doc){
  // mailSender(email,'password changed','your password has been changed sucessfully');
//})
module.exports = mongoose.model("User",userSchema);
