const mongoose= require("mongoose");

const RatingsAndReviewsschema = new mongoose.Schema({
    user:{
      type:mongoose.Types.ObjectId,
      required:true,
      ref:"User",
    },
    ratings:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        trim:true,
    },
    course:{
      type:mongoose.Types.ObjectId,
      required:true,
    }
});

module.exports = mongoose.model("RatingsAndReviews",RatingsAndReviewsschema);