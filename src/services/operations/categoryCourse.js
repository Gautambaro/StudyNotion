import {apiConnector} from "../apiConnector";
import { courseApi } from "../api";
import { toast } from "react-hot-toast";

export async function CategoryPage(categoryId){
    console.log("categoryId in api",categoryId)
    const toastId = toast.loading("...loading")
     let results = []
    try{
      const response = await apiConnector("POST",courseApi.categoryPageDetails_api,
      {categoryId:categoryId,})

      if(response.data.success){
        console.log("response",response)
        results = response.data;
        toast.success("category page fetched successfully")
      }
       
    }catch(error){
     console.log(error)
     toast.error("category page not found")
    }
    toast.dismiss(toastId)
    return results;
}