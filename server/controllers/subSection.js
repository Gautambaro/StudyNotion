const {uploadImageToCloudinary} = require("../utils/imageUpload");
const SubSection = require("../models/SubSection");
const Section =require("../models/Section");

require("dotenv").config();

exports.createSubsection = async(req,res)=>{
    try{
        const {title,description,SectionId}= req.body;
        console.log("data",title,description,SectionId)
        const file = req.files.videoFile;
        console.log("file",file);
        
        if(!title || !description  || !SectionId ){
            return res.status(404).json({
                success:false,
                message:'fill all the required properties',
            });
        }
        if(!file){
            return res.status(404).json({
                success:false,
                message:'empty video file',
            });
        }
      
     const videoData = await uploadImageToCloudinary(file,process.env.folder);
     console.log("printing video file",videoData); 
     const subSectionData = await SubSection.create({
        title:title,
        timeDuration:`${videoData.duration}`,
        description:description,
        videoUrl:videoData.secure_url,
     });
   
     const updatedSection = await Section.findByIdAndUpdate({_id:SectionId},{
        $push:{subSection:subSectionData._id},
     },{
        new:true,
     }).populate('subSection')

     res.status(202).json({
        success:true,
        message:'sub section created successfully',
        data:updatedSection,
     })
    }catch(error){
        return res.status(502).json({
            success:false,
            message:error.message,
        })
    }
}

exports.updateSubsection = async(req,res)=>{
    try{
        const {title,description,SectionId,subSectionId}= req.body;

        const subSection = await SubSection.findById(subSectionId)
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:'subSection not found with corresponding id'
            })
        }
        if(title  !== undefined){
          subSection.title = title
        }
        if(description !== undefined){
            subSection.description = description
        }
        
        if(req.files && req.files.videoFile !== undefined){
            const file=req.files.videoFile;
            const videoData = await uploadImageToCloudinary(file,process.env.folder);

            subSection.videoUrl = videoData.secure_url,
            subSection.timeDuration = `${videoData.duration}`
        }
     
      await subSection.save();

     const updatedSection = await Section.findById(SectionId).populate("subSection")
       
     if(!updatedSection){
        return res.status(404).json({
          success:false,
          message:'section not found'  
        })
     }
     res.status(202).json({
        success:true,
        message:'sub section updated successfully',
        data:updatedSection,
     })
    }catch(error){
        return res.status(502).json({
            success:false,
            message:error.message,
        });
    }
}

exports.deleteSubsection = async(req,res)=>{
    try{
        const{subSectionId,sectionId} = req.body;
     await Section.findByIdAndUpdate({_id:sectionId},
        {$pull:{subSection:sectionId},
    }) 
    const toBeDelete = await SubSection.findByIdAndDelete({_id:subSectionId});

    if(!toBeDelete){
        return res.status(400).json({
            success:false,
            message:"subSection not found with corresponding id"

        })
    }
     const updatedSection = await Section.findById(sectionId).populate("subSection");
      if(!updatedSection){
        return res.status(400).json({
         success:false,
        message:'section not found'
    })
      }
     res.status(202).json({
        success:true,
        message:'sub section deleted successfully',
        data:updatedSection,
     })
    }catch(error){
        return res.status(502).json({
            success:false,
            message:error.message,
        });
    }
}