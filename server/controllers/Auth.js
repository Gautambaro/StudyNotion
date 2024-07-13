const bcrypt = require('bcrypt');
const User= require("../models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender")
const jwt = require('jsonwebtoken');
const Profile = require("../models/Profile");



require("dotenv").config();

// send otp
 exports.sendOtp = async(req,res)=>{
    try{

        const {email}=req.body;
        const cheeckuserPresent= await User.findOne({email});

        if(cheeckuserPresent){
          return res.status(401).json({
            success:false,
            message:`user already exits with this email`,
          });
        }
      let Otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
      });
      

     const results = await OTP.findOne({OTP:Otp});
     console.log("Result is Generate OTP Func");
     console.log("OTP", Otp);
      while(results){
       Otp = otpGenerator.generate(6,{
           upperCaseAlphabets:false,
       });
         
      }
     const otpPayload={email,Otp};
      const otpBody = await OTP.create({email,OTP:Otp});
      console.log('otpPayload',otpPayload);
      console.log("priting otp body",otpBody);

      res.status(200).json({
        success:true,
        message:'otp send succfully',
        Otp,
     })
    }catch(error){
        console.log('issuse with opt generating',error);
    }
  
 }
 // signUp wala
 exports.signUp = async(req,res)=>{
    try{
      const{ firstName,lastName,email,password,confirmPassword,accountType,otp} = req.body;
        console.log(firstName,lastName,email,password,confirmPassword,accountType,otp)
      if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
        return res.status(500).json({
          success:false,
          message:'all fields are required',
        });
      }
      
      console.log(confirmPassword);
      if(password !== confirmPassword){
        return res.status(501).json({
            success:false,
            message:'password does not match with confrim password',
        });
      }
      const user = await User.findOne({email});
      
      if(user){
        return res.status(502).json({
            success:false,
            message:'user already exits with provide email',
        });
      }
      const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit({createdAt:1});
     console.log("recent OTP",recentOtp);

      if(recentOtp.length == 0){
        return res.status(402).json({
            success:false,
            message:'otp is invalid',
        });

        // in line of 86  babbar bhaiya write recentOtp.otp instead of recentotp, but in don't think there is need to write recent.otp 
      }else if(recentOtp.OTP !== otp){
        return res.status(401).json({
            success:false,
            message:'otp is incorrect',
        });
      }
      
      //password is hashed using bcrypt library
      const hasedPassword = await bcrypt.hash(password,10);
      
     const profileDetalis = await Profile.create({
     DateOfBirth:null, about:null, contact:null,gender:null, 
     });
      const validUser = await User.create({
        firstName,
        lastName,
        email,
        password:hasedPassword,
        accountType,
        additionalDetails:profileDetalis._id,
        
        Image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
       });
       
       
       res.status(200).json({
        success:true,
        message:'user entry created succesfully',
        validUser,
       })
    }catch(error){
     console.log(error);
     console.log('something went wrong');
    }
 }

 exports.login = async(req,res)=>{
    try{
      const{email,password}= req.body;
      
      if(!email || !password){
        return res.status(402).json({
            success:false,
            message:'enter required fildes',
        });
      }
      const user = await User.findOne({email})

      if(!user){
        return res.status(400).json({
            success:false,
            message:'please singup first , jaldi wahase hato '
        });
      }
     if( await bcrypt.compare(password,user.password)){
        const payload={
            email:user.email,
            id:user.id,
            accountType:user.accountType,
        }
       const token = jwt.sign(payload,process.env.jwt_secret,{
        expiresIn:"24h",
       });
       console.log(token)
      // user = to.Object(); without this we can achive
       user.token =token;
       user.password = undefined;
      
        const Options={
            expiresIn:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
       res.cookie("lilcookie",token,Options).status(200).json({
         success:true,
         user,
         token,
         message:'logged in successfully'
       });
     }else{
        return res.status(401).json({
            success:false,
            message:'password is incorrect',
        });
     }
    }catch(error){
        console.log(error);
        console.log('logged in failed');
    }
 }
 // change password

 exports.changePassword = async(req,res)=>{
  try{
     
    const{oldpassword,newPassword}=req.body;
    
    const user= await User.findById(req.user.id)
    
    if(!user){
      return res.status(400).json({
        success:false,
        message:'your userId and password does not match',
      });
    }
   
    const isValidPassword= await bcrypt.compare(oldpassword,user.password);
 
    if(!isValidPassword){
      return res.status(401).json({
        success:false,
        message:'incorrect old password'
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    
    
     await User.findOneAndUpdate({email:user.email},{password:hashedPassword},{new:true})

    res.status(200).json({
      success:true,
      message:'password changed sucessfully',
    });
  }catch(error){
   console.log(error);
   
   return res.status(404).json({
    success:false,
    message:'issue with password change',
   })
  }
   }