const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user")
//Authentication middleare

    exports.auth = async (req, res, next) => {
        try{
            //extract token
            console.log("BEFORE ToKEN EXTRACTION");
            //extract token
            const token = req.header("Authorization")?.replace("Bearer","")
                            || req.body.token 
                            || req.cookies.token ;
            console.log("AFTER ToKEN EXTRACTION",token);
            
            //if token missing, then return response
            if(!token) {
                return res.status(401).json({
                    success:false,
                    message:'TOken is missing',
                });
            }
    
            //verify the token
            try{ 
                console.log("verfying process")
                const decode =  jwt.verify(token, process.env.JWT_SECRET);
                console.log(decode);
                req.user = decode;
                console.log("after verfying")
               
            }
            catch(error) {
                //verification - issue
                return res.status(402).json({
                    success:false,
                    message:'token is invalid',
                });
            }
            next();
        }
        catch(error) {  
            return res.status(401).json({
                success:false,
                message:'Something went wrong while validating the token',
            });
        }
    }
    
    
// is student

exports.isStudent = async(req,res,next)=>{
    try{
       
      if( req.user.accountType !=="Student"){
        res.status(400).json({
            success:false,
            message:'This is protected routes for student',
        });
      }
      next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'user role cannot be verified',
        });
    }
}

// is Admin
exports.isAdmin = async(req,res,next)=>{
    try{
       

      if( req.user.accountType !=="Admin"){
       return res.status(400).json({
            success:false,
            message:'This is protected routes for Admin',
        });
      }
      next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'user role cannot be verified',
        });
    }
}

// is Instructor

exports.isInstructor = async(req,res,next)=>{
    try{
       
      if( req.user.accountType !=="Instructor"){
        return res.status(400).json({
            success:false,
            message:'This is protected routes for Instructor',
        });
      }
      next();
    }catch(error){
        
        return res.status(500).json({
            success:false,
            message:'user role cannot be verifed',
        });
    }
}