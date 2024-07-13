
const CourseProgress = require("../models/courseProgress")
const subSection = require("../models/SubSection")

exports.UpdateCourseProgress = async(req,res)=>{
    const {courseId,subSectionId} = req.body;
    const userId = req.user.id;
    console.log("courseId",courseId);
    console.log("userId",userId)
  try{
     const subsection = await subSection.findById(subSectionId);
     if(!subsection){
        return res.status(404).json({
            success:false,
            message:'invalid subSection'
        })
     }
     let courseProgress = await CourseProgress.findOne({userId:userId,courseID:courseId})
     console.log("courseProgress",courseProgress)
     if(!courseProgress){
        return res.status(500).json({
           success:false,
           message:'course progress does not exits'
        })
     }
     if(courseProgress.completedVideo.includes(subSectionId)){
        return res.status(500).json({
            success:false,
            message:'already completed'
        })
     }else{
        courseProgress.completedVideo.push(subSectionId)
     }
     await courseProgress.save();
     
     return res.status(200).json({
        success:true,
        message:'courseProgress added successfully'
     })
  }catch(error){
    console.log(error)
  }
}