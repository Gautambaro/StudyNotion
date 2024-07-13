const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
        
    },
    DateOfBirth:{
        type:String,
        
    },
    about:{
        type:String,
    
    },
    contact:{
        type:Number,
        trim:true,
    }
});

const Profile = mongoose.model("Profile",profileSchema);
module.exports = Profile;