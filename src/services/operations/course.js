
import { courseApi } from "../api";
import { apiConnector } from "../apiConnector";
import { toast } from "react-hot-toast";



export async function getCategory(){
      let category = null;
      try{
         const response = await apiConnector("GET",courseApi.showAllCategories_api)
         if(response){
            console.log("response",response)
         }
         category = response.data.allTagDetails

      }catch(error){
            console.log(error)
      }
      return category;
}
export async function createCourse(formData,token){
     
      const toastId = toast.loading("Loading...")
      let results = null;
   try{
     
      const response = await apiConnector("POST",courseApi.createCourse_api,formData,{
            "Content-Type" :"multipart/form-data",
            Authorization :`Bearer${token}`,
      })
      console.log("response",response)
      if(!response.data.success){
            console.log("could not get data")
      }
      results = response?.data?.data;
      toast.success("course created successfully")
   }catch(error){
      console.log(error)
      
   }
   
   toast.dismiss(toastId);
   return results;
   
}
  
export async function EditCourse(formData,token){
     
   const toastId = toast.loading("Loading...")
   let results = null;
try{
  
   const response = await apiConnector("POST",courseApi.updateCourse_api,formData,{
         "Content-Type" :"multipart/form-data",
         Authorization :`Bearer${token}`,
   })
   console.log("response",response)
   if(!response.data.success){
         toast.error("could not get data")
   }
   results = response?.data?.data;
   toast.success("course updated successfully")
}catch(error){
   console.log(error)
   
}

toast.dismiss(toastId);
return results;

}

export async function deleteCourse(courseId,token){
     console.log(courseId)
   const toastId = toast.loading("Loading...")
   let results = null;
try{
  
   const response = await apiConnector("POST",courseApi.deleteCourse_api,courseId,{

         Authorization :`Bearer${token}`,
   })
   console.log("response",response)
   if(response.data.success){
      toast.success("course deletd successfully")
   }else{
      toast.error("could not delete course")
   }
   results = response?.data?.data;
   
}catch(error){
   console.log(error)
   
}

toast.dismiss(toastId);
return results;

}

export async function createSection(data,token){
   const toastId = toast.loading("...loading")
   let results = null;
   try{
     const response = await apiConnector("POST",courseApi.createSection_api,data,{
      Authorization :`Bearer${token}`,
     })
     if(response){
      toast.success("course created")
      console.log("response",response)
     }
     
     results = response.data.data;
   }catch(error){
    console.log(error);
    toast.error("could not create course")
   }
   toast.dismiss(toastId)
   return results;
   
}



export async function updateSection(data,token){
   console.log("printing token",token)
   console.log("data",data)

   const toastId = toast.loading("...loading");
   let results = null;
   try{
      const response = await apiConnector("POST",courseApi.updateSection_api,data,{
         Authorization :`Bearer${token}`,
      })
      if(!response?.data?.success){
         toast.error("could not update Section")
      }
      console.log("response",response)
      toast.success("section updated successfully");
      results = response?.data?.data;
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId);
   return results;
}

export async function deleteSection(data,token){
   console.log("data",data)
   console.log("token",token)
   const toastId = toast.loading("...loading");
   let results = null;
   try{
      const response = await apiConnector("POST",courseApi.deleteSection_api,data,{
         Authorization :`Bearer${token}`,
      })
      if(!response?.data?.success){
         toast.error("could not delete Section")
      }
      console.log("response",response)
      toast.success("section deleted successfully");
      results = response?.data?.data;
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId);
   return results;
}


export async function createSubSection(data,token){
   console.log(data,token)
   const toastId= toast.loading("...loading");
   let results =null;
   try{
       const response = await apiConnector("POST",courseApi.createSubsection_api,data,{
         Authorization: `Bearer${token}`,
       })
       if(response.data.success){
         toast.success("subsection created")
         results = response.data.data;
       }
       console.log("response",response)
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId)
   return results;
}

export async function updateSubSection(data,token){

   const toastId= toast.loading("...loading");
   let results =null;
   try{
       const response = await apiConnector("POST",courseApi.updateSubsection_api,data,{
         Authorization: `Bearer${token}`,
       })
       console.log("response",response)
       if(response.data.success){
         toast.success("subsection update successfully")
         results = response.data.data;
       }
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId)
   return results;
}
export async function deleteSubSection(data,token){
   const toastId= toast.loading("...loading");
   let results =null;
   try{
       const response = await apiConnector("POST",courseApi.deleteSubSection_api,data,{
         Authorization: `Bearer${token}`,
       })
       if(response.data.success){
         toast.success("subsection deleted")
         results = response.data.data;
       }
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId)
   return results;
}

export async function instructorCourses(token){
   
   const toastId= toast.loading("...loading");
   let results =null;
   try{
       const response = await apiConnector("GET",courseApi.getInstructorCourse_api,null,{
         Authorization: `Bearer${token}`,
       })
       console.log("response",response)
       if(response.data.success){
         toast.success("got courses successfully")
         results = response.data.data;
       }
   }catch(error){
      console.log(error)
   }
   toast.dismiss(toastId)
   return results;
}


export async function getFullCourseDetails(token,courseId){
   console.log("couseId in api call",courseId)
 const toastId = toast.loading("Loading...")
 let results = null;
try{

 const response = await apiConnector("POST",courseApi.fullCourseDetails_api,{courseId},{

       Authorization :`Bearer${token}`,
 })
 console.log("response",response)
 if(response.data.success){
    toast.success("course fetch successfully")
 }else{
    toast.error("could not fetch course")
 }
 results = response.data.data;
 
}catch(error){
 console.log(error)
 
}

toast.dismiss(toastId);
return results;

}


export async function courseProgress(data,token){
   const toastId = toast.loading("...Loading")
   let results;
   try{
     const response = await apiConnector("POST",courseApi.updateCourseProgressApi,data,{
      Authorization :`Bearer${token}`,
     })
     console.log("response",response)
     if(response.success){
      toast.success(response.message)
     }
     results = response;
   }catch(error){
      console.log(error)
      toast.error(error.message)
   }
   toast.dismiss(toastId)
   return results;
}


export const fetchCourseDetails = async (courseId) => {
   const toastId = toast.loading("Loading...")
   //   dispatch(setLoading(true));
   let result = null
   try {
     const response = await apiConnector("POST", courseApi.getCourseDetails_api, 
      {courseId} ,
     )
     console.log("COURSE_DETAILS_API API RESPONSE............", response)
 
     if (!response.data.success) {
       throw new Error(response.data.message)
     }
     result = response.data.data
     toast.success("data fetch")
   } catch (error) {
     console.log("COURSE_DETAILS_API API ERROR............", error)
      toast.error(error.message)
     // toast.error(error.response.data.message);
   }
   toast.dismiss(toastId)
   //   dispatch(setLoading(false));
   return result
 }
 
