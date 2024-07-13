import {ratingApiEndpoints} from "../api"
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";

export async function CreateRating(data,token){
       console.log("data",data)
      console.log("token",token)
    const toastId = toast.loading("...loading")
    let results
    try{
      console.log("im inside api call")
      const response = await apiConnector("POST",ratingApiEndpoints.createRating_API,data,{
          Authorization: `Bearer${token}`,
      })
      if(response.data.success){
        toast.success("review added")
      }
       results = response;
    }catch(error){
     console.log(error)
     toast.error("you have already give review")
    }
    toast.dismiss(toastId)
    return results;
}

