const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
        required:true,
    },
    additionalUrl:{
        type:String,
    },
    timeDuration:{
        type:String,
    }
});
module.exports = mongoose.model("SubSection",subSectionSchema);