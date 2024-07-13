import { setLoading,setToken } from "../../redux/slices/authSlice";
import {toast} from "react-hot-toast";
import { Auth } from "../api";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { resetCart } from "../../redux/slices/cartSlice";




export function sendOtp(email,navigate){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try{
     const response = await apiConnector("POST",Auth.SendOTP_API,{email,cheeckUserPresent:true})
     if(response){
      dispatch(setLoading(false))
      toast.success("otp send successfully")
      navigate("/otpPage")
      dispatch(setLoading(false));
     }
    }catch(error){
      console.log(error);
    }
  }
}


 export function login(email,password,navigate){
  
   return async(dispatch)=>{
     dispatch(setLoading(true))
     const toastId= toast.loading("Loading...")
     try{
       const response = await apiConnector("post",Auth.Login,{email,password})
       console.log("printing login response",response)
       if(!response.data.success){
        console.log(response.data.message);
        
       }
       toast.success("login succesfull")
       dispatch(setToken(response.data.token));
       
       
       const userImage = response.data.userImage ? response.data.userImage :
      `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
       dispatch(setUser({...response.data.user,image:userImage}));
       
    
       localStorage.setItem("user",JSON.stringify((response.data.user)));
       localStorage.setItem("token",JSON.stringify((response.data.token)));
       navigate("/dashboard/myProfile");
     }catch(error){
       console.log(error)
       toast.error("Login failed")
     }
     dispatch(setLoading(false))
     toast.dismiss(toastId)
   }
 }
 
 
 
 export  function signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
    console.log(otp,firstName,lastName,email,password,confirmPassword,accountType)
   return async(dispatch)=>{
   
    try{
      dispatch(setLoading(true));
      const response = await apiConnector("POST",Auth.Signup,{otp,firstName,lastName,email,password,confirmPassword,accountType});
      console.log(response)
      if(!response){
       toast.error("signUp failed");
 
      }
      toast.success("opt has been sent")
      navigate("/Login");
      dispatch(setLoading(false));
      toast.success("signup successfull");
    }catch(error){
      console.log(error);
      toast.error("signup failed")
     
    }
     

   }
 }

 export function logout(navigate){
  return(dispatch)=>{
    navigate("/");
    toast.success("logged out succesfully");
    dispatch(setToken(null));
    dispatch(setUser(null));
    // dispatch(resetCart());
    localStorage.removeItem("token");
    // localStorage.removeItem("user");
    toast.success("logged out successfully");
  }
 }
  export function resetPasswordToken(email,setSendEmail){
    
   return async(dispatch)=>{
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try{
     const response = await apiConnector("POST",Auth.resetToken,{email,});
     console.log("response",response)
     if(response){
    
      toast.success("email send successfully");
      dispatch(setLoading(false))
      setSendEmail(true)
     }
    }catch(error){
    console.log(error)
    toast.error("Failed To Send Reset Email")

    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
   }
  }

  export function resetPassword(password,confirmPassword,token,navigate){
    console.log("password",password,"confirmPassword",confirmPassword)
   return async(dispatch)=>{
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...")
    try{
      if(password === confirmPassword){
        const response = await apiConnector("POST",Auth.resetPassword,{password,confirmPassword,token});
        if(response){
          setLoading(false);
          toast.success("your password has been reset successfully");
          navigate("/")
         }
      }else{
        toast.error("password does not match with confirmPassword");
      }
     
    
    }catch(error){
      console.log(error)
      toast.error("something went wrong");
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))

   }
  }

  