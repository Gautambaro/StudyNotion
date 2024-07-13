import { setUser } from "../../redux/slices/profileSlice"
import { apiConnector } from "../apiConnector"
import {profileApi} from "../api"
import { toast } from "react-hot-toast"



export function userDetalis (token){
    
    return async(dispatch)=>{
        try{
            const response = await apiConnector("GET",profileApi.getUserDeatails, null, {
                Authorization: `Bearer${token}`,
            })
            console.log("user details",response)
             const userImage = response.data.data.Image ? response.data.data.Image:
             `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
             dispatch(setUser({...response.data.data, image:userImage}))
             localStorage.setItem("user",JSON.stringify(response.data.data))
            
           
        }catch(error){
          
           toast.error("Could Not Get User Details")
           console.log(error)
        }
    }
}

export async function userCourseDetails(token){
    const toastId = toast.loading("...loading")
    let results;

    try{
        const response = await apiConnector("GET",profileApi.getUserEnrolledCourse,null,{
            Authorization:`Bearer${token}`
        })

        if(response.data.success){
            console.log("response",response)
            toast.success("user course fetch successfully")
            results=response.data.data;
        }

    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
   toast.dismiss(toastId)
   return results;
}


export async function getInstructorDeshboard(token){
    const toastId = toast.loading("...loading")
    let results
    try{
       const response = await apiConnector("GET",profileApi.getInstructorDashboard,null,{
         Authorization:`Bearer${token}`
       })
       console.log("response",response)
       if(response.data.success){
        toast.success("instructor stats get sucessfully")
        results = response.data.courses
       }
    }catch(error){
        console.log(error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return results;
}