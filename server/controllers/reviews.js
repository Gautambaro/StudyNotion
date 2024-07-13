const { default: mongoose } = require("mongoose");
const RatingsAndReviews = require("../models/RatingsAndReviews");
const Course = require("../models/Course");

exports.createRatingsAndReviews = async(req,res)=>{
    try{
     const{courseId,review,ratings} = req.body;
     const userId = req.user.id;
    
     const enrolledStudent = await Course.findById(courseId);
   

     if(!enrolledStudent.studentEnrolled.includes(userId)){
        return res.status(400).json({
            success:false,
            message:'you do not have the authority to give ratings',
         });
     }
     const alreadyRatings = await RatingsAndReviews.findOne({user:userId,course:courseId});
   
     if(alreadyRatings){
        return res.status(400).json({
            success:false,
            message:`you have already give ratings on this course:${courseId}`
        });
     }
    
    const reviewDetails = await RatingsAndReviews.create({
        user:userId,
        review,
        ratings,
        course:courseId,
    });  
    await Course.findByIdAndUpdate(courseId,{$push:{ratingAndReview:reviewDetails._id}});
    res.status(200).json({
        success:true,
        message:'review added successfully',
     })
    }catch(error){
     console.log(error);
     return res.status(400).json({
        success:false,
        message:error.message,
     });
    }
}


exports.getAvergaeratings = async(req,res)=>{
    try{
        const {courseId} = req.body;
        const ratingDetails = await RatingsAndReviews.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ]);
        await RatingsAndReviews.populate("ratingDetails",{path:"user",select:"firstName,image,email"});
        
        if(ratingDetails.length>0){
            return res.status(200).json({
                success:true,
                averageRating:results[0].averageRating,
                message:''
            });
        }
        if(!ratingDetails){
            return res.status(200).json({
                success:true,
                message:'Average rating is 0, till now no one is giving the ratings'
            })
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            averageRating:error.message,
        });
    
}
}


exports.getAllratings = async(req,res)=>{
    try{
      const Allratings = await RatingsAndReviews.find().sort({ratings:"desc"})
      .populate("user")
      .populate("course")
    .exec();
      return res.status(200).json({
        success:true,
        message:'got all ratings',
        data:Allratings,
      });
    }catch(error){
     console.log(error);
     return res.status(400).json({
        success:false,
        message:error.message,
     });
    }
}