const Course = require("../models/Course");
const User = require("../models/user");
const Category = require("../models/category");
const courseProgress = require ("../models/courseProgress")
const {uploadImageToCloudinary} = require("../utils/imageUpload");
const {convertSecondsToDuration} = require ("../utils/SecToDuration")
require("dotenv").config();

exports.createCourse = async(req,res)=>{

    try{
        const userId = req.user.id;
        let {courseName,courseDescription,price,tag:_tag,whatWillYouLearn ,instructions:_instructions,category ,status} = req.body;
        
        const thumbnail = req.files.thumbnailImage;
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);
        if(!courseName || !courseDescription || !price || !whatWillYouLearn  || !category  ){
            return res.status(400).json({
                success:false,
                message:'all fileds are required',
            });
        }
       if(!status || status === undefined){
        status = "draft";
       }
     const InstructorDetalis = await User.findById(userId,{accountType :"Instructor"});
     //const instructorId = InstructorDetalis._id;
    
     
     if(!InstructorDetalis){
      return res.status(500).json({
        success:false,
        message:'Instructor details not found',
      });
     }
    
     const categoryDetails = await Category.findById(category)
     console.log('printing category',categoryDetails)
     if(!categoryDetails){
        return res.status(404).json({
            success:false,
            message:'category details not found ',
        });
     }
     const imageFile = await uploadImageToCloudinary(thumbnail,process.env.folder);
    console.log("priting imagefile",imageFile);
     const newCourse = await Course.create({
        Name:courseName,
        description:courseDescription,
        price,
        tags:tag,
        whatWillYouLearn:whatWillYouLearn,
        instructions:instructions,
        category:categoryDetails._id,
        instructor:InstructorDetalis._id,
        status:status,
        thumbnail:imageFile.secure_url,
     });
     console.log("printing new course",newCourse)
       const updatedCourse= await User.findByIdAndUpdate({_id:InstructorDetalis._id},{$push:{courses:newCourse._id}},{new:true});
       console.log("updated courseDetails",updatedCourse)
        await Category.findByIdAndUpdate({_id:categoryDetails._id},{$push:{course:newCourse._id}},{new:true});
     
      
    
      res.status(200).json({
        success:true,
        message:'course created successfully',
        data:newCourse,
      });

    }catch(error){
        console.log(error)
        return res.status(404).json({
            success:false,
            message:error.message,

        });
    }
   
}


exports.getAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find(
          { status:"published"},
          {
            courseName:true,
            price:true,
            thumbnail:true,
            ratingAndReview:true,
            instructor:true,
            studentEnrolled:true,
          }
        ).populate("instructor").exec();
        res.status(200).json({
            success:true,
            message:'get all courses successfully',
            data:allCourses,
        })
    }catch(error){
        console.log(error);
        return res.status(501).json({
            success:false,
            message:'can not find courses',
            error:error.message, 
        });
    }
      


}

exports.getCourseDetails = async (req, res) => {
  try {
    const  {courseId} = req.body
    console.log("courseId",courseId)

    const courseDetails = await Course.findOne({
     _id: courseId
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()
 
       console.log("courseDetails",courseDetails)
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.updateCourse = async(req,res)=>{
try{
  
  const {courseId} = req.body;
  const updates = req.body;
  console.log("updates",updates)
  const course = await Course.findById(courseId);

  if(!course){
    return res.status(400).json({
      success:false,
      message:'course not found with associated id'
    });
  }
 
   if(req.files){
    console.log("thumbnailUpdate")
    const thumbnail = req.files.thumbnail;
    console.log("thumbnail",thumbnail)
    const imageFile = await uploadImageToCloudinary(thumbnail,process.env.folder);
    course.thumbnail = imageFile.secure_url
   }
  for (const key in updates){
    if(updates.hasOwnProperty(key)){
      if(key==="tag" || key ==="instructions"){
        course[key] = JSON.parse(updates[key])
      }else{
        course[key] = updates[key]
      }
    }
  }
 await course.save()
   const updateCourse = await Course.findOne({_id:courseId}).populate({path:"instructor",populate:{path:"additionalDetails"},})  
   .populate("category")
   .populate("ratingAndReview")
   .populate({path:"courseContent",populate:{path:"subSection"}}).exec()


   return res.status(200).json({
    success:true,
    message:"course details updated successfully",
    data:updateCourse
   })
}catch(error){
    console.log(error);
    return res.status(400).json({
       success:false,
       message:error.message,
       
    });
}
}

exports.getInstructorCourse = async(req,res)=>{
  try{
     const userId = req.user.id;
     console.log("user id",userId)
     if(!userId){
      return res.status(400).json({
        success:false,
        message:'user id not found'
      })
     } 
     const InstructorCourses = await Course.find({instructor:userId}).sort({createdAt:-1})

     return res.status(200).json({
      success:true,
      message:'course send successfully',
      data:InstructorCourses
     })
  }catch(error){
    return res.status(404).json({
      success:false,
      message:error.message
    })
  }
}

exports.deleteCourse = async(req,res)=>{
  try{
    const {courseId} = req.body;
    console.log("cid",courseId);
    const userId = req.user.id;
    if(!courseId){
      return res.status(500).json({
        success:false,
        message:'invalid course'
      })
    }
    if(!userId){
      return res.status(500).json({
        success:false,
        message:'invalid user'
      })
    }
    const toBedeleted = await Course.findByIdAndDelete(courseId);

    const updateCourse = await Course.find({instructor:userId})
   
    return res.status(200).json({
      success:true,
      message:'course deleted successfully',
      data:updateCourse,
    })
  }catch(error){
   return res.status(404).json({
    success:false,
    message:error.message,
   })
  }
}

exports.fullCourseDetails = async(req,res)=>{
  try{
    const{courseId} = req.body;
    console.log("courseId",courseId)
    const userId = req.user.id;
    console.log("userId",userId)
    const course = await Course.findById(courseId)
    .populate({
      path:"instructor",
      populate:{path:"additionalDetails"},
    })
    .populate("category")
    .populate("ratingAndReview")
    .populate({path:"courseContent",populate:{path:"subSection"},
  }).exec()

  
  let courseProgressCount = await courseProgress.findOne({courseID:courseId,userId:userId})
             
     console.log("courseProgressCount",courseProgressCount) 

    if(!course){
      return res.status(404).json({
        success:false,
        message:'course not found'
      })
    }

    let totalDuration = 0;
    course.courseContent.forEach((content)=>{
      content.subSection.forEach((subSection)=>{
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDuration += timeDurationInSeconds
      })
    })

    const TotaltimeDuration =  convertSecondsToDuration(totalDuration)

    return res.status(200).json({
      success:true,
      message:"full course details send successfully",
      data:{
         course,
         TotaltimeDuration,
         completedVideos : courseProgressCount?.completedVideo
         ? courseProgressCount?.completedVideo
         : [],

      }
    })

  }catch(error){
   return res.status(404).json({
    success:false,
    message:error.message,
   })
  }
  
}