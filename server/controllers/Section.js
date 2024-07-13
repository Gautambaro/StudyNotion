 const Section = require("../models/Section");
 const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

 exports.createSection = async(req,res)=>{
   try{
      const {sectionName,courseId}=req.body;
      if(!sectionName || !courseId){
        return res.status(404).json({
           success:false,
           message:'pleae fill the input first'
        });
      }
      const SectionDetalis = await Section.create({
         sectionName:sectionName,
      });
      console.log("sectionDetalis,SectionDetails")
     const updatedCourse = await Course.findByIdAndUpdate(courseId,
         {
            $push:{courseContent:SectionDetalis._id},
                        
         },
         {new:true}
         ).populate({path:"courseContent",populate:{path:"subSection",},
      }).exec();

       console.log(updatedCourse)
         return res.status(200).json({
            success:true,
            message:'section created successfully',
            data:updatedCourse,
         }); 
   }catch(error){
      console.log(error)
      return res.status(500).json({
         success:false,
         message:error.message,
      });
   }
    
 };

 exports.SectionUpdate= async(req,res)=>{
 try{
   const{sectionName,sectionId,courseId} = req.body;
   console.log(sectionName)
   const updatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});
   const updateCourse = await Course.findById(courseId).populate({
      path:"courseContent",
      populate:{
         path:"subSection",
      },
   }).exec();
   console.log(updatedSection)
   res.status(200).json({
      success:true,
      message:'updated section Name',
      data:updateCourse,

   })
 }catch(error){
   console.log('error uploading section',error)
   return res.status(500).json({
      success:false,
      message:'internal server error',
   });
 }
 };

 exports.deleteSection = async(req,res)=>{
   try{
      const {sectionId,courseId} = req.body;
       
      await Course.findByIdAndUpdate(courseId,{$pull:{
         courseContent:sectionId,
      }})

      const section = await Section.findById(sectionId)
      if(!section){
         res.status(400).json({
            success:false,
            message:'section not found',
         });
   
      }
     await SubSection.deleteMany({_id:{$in:section.subSection}});
     const updatedSection = await Section.findByIdAndDelete(sectionId);
     const updatedCourse = await Course.findById(courseId).populate({path:"courseContent",populate:{path:"subSection"}}).exec()

     return res.status(200).json({
      success:true,
      message:"section deleted successfully",
      data:updatedCourse,
     })
   }catch(error){
      console.error("Error deleting section:", error);
      return res.status(500).json({
         success:false,
         message:'internal server error',
      });
   }
   
 }