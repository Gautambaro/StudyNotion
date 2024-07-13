const User = require("../models/user");
const {mailSender}=require("../utils/mailSender")
const crypto = require('crypto');
const bcrypt = require('bcrypt')

exports.resetToken= async(req,res)=>{
    try{
        const email = req.body.email;
        const user = await User.findOne({email});

        if(!user){
         return res.status(501).json({
            success:false,
            message:'you are not valid user',
         });
        }
    // generate token
    
    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate({email},{token:token,resetPasswordExpires:Date.now()+50*60*1000},{new:true});
    
    //now we have to create a url
    const url = `http://localhost:3000/update-password/${token}`;
    mailSender(email,'reset passwor Link',`you can reset your password using this link: ${url}`);

    return res.status(201).json({
        success:true,
        message:'email send successfully',
    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went wrong while sending reset password mail',
        });
    }
   

}
exports.resetPassword = async(req,res)=>{
    try{
    const{password,confirmPassword,token}=req.body;
    
    if(password !== confirmPassword){
        return res.status(501).json({
            success:false,
            message:'password does not macth with confirmPassword',
        });
    }
    const userDetalis = await User.findOne({token:token});
    if(!userDetalis){
        return res.status(500).json({
            success:false,
            message:'you are not a valid user',
        });
    }
    if(userDetalis.resetPasswordExpires < Date.now()){
      return res.status(502).json({
        success:false,
        message:'token is expired please regenerate it',
      });
    }
     const hasedPassword= await bcrypt.hash(confirmPassword,10);

     await User.findOneAndUpdate({token:token},{password:hasedPassword},{new:true});
     res.status(200).json({
        success:true,
        message:'your password is successfully reset',
    });
    }catch(error){
        console.log(error);
        console.log('something went wrong while verifynig user')
    }
}