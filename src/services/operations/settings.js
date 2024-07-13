import { toast }  from "react-hot-toast"
import { apiConnector } from "../apiConnector";
import { profileApi} from "../api";
import { Auth } from "../api";
import { setUser } from "../../redux/slices/profileSlice";

export function updateProfilePic (token, formData){
    console.log("pisc", formData)
    return async(dispatch)=>{
        const toastId = toast.loading("loading...");
        try{
           const response = await apiConnector("PUT", profileApi.updateProfilePic,formData,{
            "Content-Type":"multipart/formData",
            "Authorization" :`Bearer${token}`,
           })
           if(response){
            console.log("response",response)
            toast.success("profile picture update successfully")
            dispatch(setUser(response.data.data));
            localStorage.setItem("user",JSON.stringify(response.data.data))
           }
        }catch(error){
            console.log(error)
            toast.error("could not update profile picture")
        }
        toast.dismiss(toastId)
    }
}

export function updateProfile (token ,data,navigate){
    
    return async (dispatch)=>{
        const toastId = toast.loading("...Loading")
     try{
        const response = await apiConnector("POST",profileApi.updateProfileDetails,data,{
           
            "Authorization" :`Bearer${token}`,
        })
        if(response){
           toast.success("profile detalis upddated successfully");
           console.log("response",response)
           const userImage = response.data.updatedUserDetails.image ? response.data.updatedUserDetails.image:
           `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
           dispatch(setUser({...response.data.updatedUserDetails,Image:userImage}))
           localStorage.setItem("user",JSON.stringify(response.data.updatedUserDetails))
           navigate("/dashboard/my-profile")
        }
     }catch(error){
       console.log(error);
       toast.dismiss(toastId)
     }
    }
}
export async function changePasswordApi (token,formData,navigate){
    console.log("token",token)
    console.log("url",Auth,Auth.changePassword)
    const toastId = toast.loading("loading...")
 try{
     const response = await apiConnector("POST",Auth.changePassword,formData,{
        "Authorization" :`Bearer${token}`,
     })
     if(response){
     console.log("response password",response)
     toast.success("password has been changed successfully");
     navigate("/dashboard/my-profile")
    }
 }catch(error){
    console.log(error)
    
 }
 toast.dismiss(toastId)
}

export function deleteAccount (){
    
}