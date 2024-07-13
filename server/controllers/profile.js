const Profile = require("../models/Profile");
const User = require("../models/user");
const {uploadImageToCloudinary} = require("../utils/imageUpload")
const CourseProgress = require("../models/courseProgress")
const {convertSecondsToDuration} = require("../utils/SecToDuration");
const Course = require("../models/Course")
  


console.log("courseprogress",CourseProgress)
exports.updateProfile = async(req,res)=>{
    try{
     const{firstName,lastName,gender ="",DateOfBirth ="",about ="",contact,} = req.body;
     const userId = req.user.id;
     console.log("properties",gender,DateOfBirth,about,contact,userId)
     if(!gender || !contact || !userId){
        return res.status(404).json({
            success:false,
            message:'please fill all the required properties',
        });
     }
     const userDetalis = await User.findById(userId);

     const profile = await Profile.findById(userDetalis.additionalDetails);
     
     profile.gender = gender;
     profile.about=about;
     profile.DateOfBirth=DateOfBirth;
     profile.contact=contact;
     await profile.save();
     
       return res.json({
            success:true,
            message:'profile updated successfully',
            profile,
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'issue with creating profile'
        })
    }
}

exports.deleteAccount = async(req,res)=>{
    try{
        const userId = req.user.id;
        const userDetalis = await User.findById(userId);
        console.log(userDetalis)
        if(!userDetalis){
            return res.status(500).json({
                success:false,
                message:'you are not a valid user to delete this account',
            });
        }
        console.log(userDetalis.additionalDetails)
      const toBeDelete =  await Profile.findByIdAndDelete(userDetalis.additionalDetails._id);
    console.log("printing to be deleted id",toBeDelete)
    const delay = 5 * 24 * 60 * 60 * 1000;

    // Schedule task to run after delay
    setTimeout(async () => {
        try {
            // Find and delete the user
            await User.findByIdAndDelete(userId);
            console.log('User deleted after delay');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }, delay);
        res.status(200).json({
            success:true,
            message:'your account deleted successfully'
        })
        
    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
    
}

exports.updateProfilePicture = async(req,res)=>{
    console.log("clodinary", uploadImageToCloudinary)
    try{
        const image = req.files.imageFile;
        const userId = req.user.id;
        console.log("image",image)
       const profileDetails = await User.findById(userId);
    
       if(!profileDetails){
        return res.status(400).json({
            success:false,
            message:'proflie details not found with provided id'
        });
       }
       const imageresponse = await uploadImageToCloudinary(image, process.env.folder,1000,1000);
       console.log(imageresponse)
       await User.findByIdAndUpdate(userId,{Image:imageresponse.secure_url},{new:true});
    
       res.status(200).json({
        success:true,
        message:'profile picture updated successfully',
        data:profileDetails,
       });
    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:error.message,

        });
    }
    
}
exports.getEnrolledCourses = async(req,res)=>{
    try{
      const userId = req.user.id;
     
    //   const userDetails = await User.findOne({_id:userId}).populate("courses").exec()
    //    console.log("course",userDetails.courses)
       
        let userDetails = await User.findOne({_id:userId
        }).populate({
            path:"courses",
            populate:{
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            },
        }).exec()
         
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideo.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
  
        
      if(!userDetails ){
        return res.status(400).json({
            success:false,
            message:'enrolled course details not found',
        });
        
      }
      res.status(200).json({
        success:true,
        data:userDetails.courses,
        message:'enrolled course details fetch successfully',
      })
    }catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

// exports.getAllUserDetalis = async(req,res)=>{
//     try{
//     const userId = req.user.id;

//     const userDetalis = await User.findById(userId).populate("additionalDetails").exec();

//     if(!userDetalis){
//         return res.status(404).json({
//             success:false,
//             message:'user detalis not found',
//         })
//     }
//     res.status(200).json({
//         success:true,
//         message:'user detalis found',
//         data: userDetalis.additionalDetails,
//     })
//   }catch(error){
//     console.log(error)
//     return res.status(400).json({
//         success:false,
//         message:error.message,
//     })
//   }
// }
exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


 exports.getInstructorDashboard = async (req,res)=>{
      
    try{
        const instructorCourse =  await Course.find({ instructor: req.user.id })

        console.log("instructorcourse",instructorCourse)
        const courseData = instructorCourse.map((course)=>{
            const totalEnrolledStudent =  course.studentEnrolled.length
            const totlAmountGenetared = totalEnrolledStudent*course.price

            const courseDataWithStats = {
                _id : course._id,
                courseName : course.Name,
                courseDescription:course.description,
                totalEnrolledStudent,
                totlAmountGenetared
            }
            return courseDataWithStats
         }
        )
       console.log("courseData",courseData)

       return res.status(200).json({
        success:true,
        message:'fetch instructor course stats',
        courses:courseData ,
       })
    }catch(error){
       console.log(error)
       return res.status(404).json({
        success:false,
        message:error.message,
       })
    }
 }
