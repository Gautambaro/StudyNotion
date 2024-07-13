 const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({

    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Course",
    },
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref:"User"
    },
    completedVideo:[
        {
            type:mongoose.Types.ObjectId,
            required:true,
            ref:"SubSection",
        }
    ],
});

module.exports = mongoose.model("CourseProgress",courseProgressSchema);