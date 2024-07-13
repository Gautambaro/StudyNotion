


const { default: mongoose } = require("mongoose");
const Category = require("../models/category");


function getRandomInt(max){
   return Math.floor(Math.random()*max)
}
exports.createCategory= async(req,res) =>{
    try{
     const {name, description} = req.body;
     if(!name){
        return res.status(400).json({
           success:false,
           message:'all fields are required' 
        });
     }
     const categoryDetails = await Category.create({
      name:name, description:description
     })
     console.log(categoryDetails);
     res.status(200).json({
        success:true,
        message:'category created succesfully'
     })
    }catch(error){
        return res.status(404).json({
            success:false,
            message:error.message,
        })
    }
};

exports.showAllCategories = async(req,res)=>{
 try{
   const allTagDetails = await Category.find ({},{name:true, description:true}).populate("course").exec();


   res.status(200).json({
    success:true,
     message:'find all tags successfully',
     allTagDetails,
   });
 }catch(error){
    console.log(error);
    return res.status(402).json({
        success:false,
        message:error.message,
    })
 }
}

exports.categoryPageDetails = async(req,res)=>{
    try{
     const {categoryId} = req.body;
     console.log("categoryId",categoryId)
      console.log("hello MR Strak")

     const tagCategory = await Category.findById(categoryId)
     .populate({
      path:"course",
      match: {status:"published"},
      populate: [
         { path: "instructor" },
         { path: "ratingAndReview" }
       ]
     }).exec();
    
     if(!tagCategory){
        return res.status(400).json({
            success:false,
            message:'Data not found'
        });
        
     }

     if(tagCategory.course.length === 0){
      return res.status(400).json({
         success:false,
         message:"no course found"
      })
     }

     const differentCategoryExceptSelected = await Category.find({_id:{$ne:{_id:categoryId},}})

      let differentCategory = await Category.findOne(
         differentCategoryExceptSelected[getRandomInt(differentCategoryExceptSelected.length)]._id 
      )
      .populate({
         path:"course",
         match: {status:"published"},
         populate: [
            { path: "instructor" },
            { path: "ratingAndReview" }
          ]
        }).exec();

   
    const allCateorys = await Category.find()
    .populate({
      path:"course",
      match: {status:"published"},
      populate: [
         { path: "instructor" },
         { path: "ratingAndReview" }
       ]
     }).exec();
     
     console.log("allcategory",allCateorys)
     console.log("come up to here")
     const allCourses = allCateorys.flatMap((category)=>category.course)
     const mostSellingCourses = allCourses.sort((a,b)=>b.sold-a.sold).slice(0,10)

    
     return res.status(200).json({
        success:true,
        data:{
            tagCategory,
            differentCategory,
            mostSellingCourses,
        },
        
     });
    }catch(error){
 console.log(error)
 return res.status(400).json({
    success:false,
    message:error.message,
 })
    }
}

