import { useDispatch, useSelector } from "react-redux";
import {useForm} from "react-hook-form"
import { useState } from "react";
import { setStep } from "../../../../../redux/slices/addCourseSlice";
import { useEffect } from "react";
import IconBtn from "../../../../common/IconBtn";
import {COURSE_STATUS} from "../../../../../utils/constants"
import { resetCourse } from "../../../../../redux/slices/addCourseSlice";
import { useNavigate } from "react-router-dom";
import { EditCourse } from "../../../../../services/operations/course";


 const PublishCourse = () => {
    const [loading,setLoading] = useState(false);
    const {register, handleSubmit,setValue,getValues,formState:{erros}} = useForm();
    
    const {course} = useSelector((state)=>state.course);
    const {token} = useSelector((state)=>state.auth);
   const dispatch = useDispatch();
   const Navigate = useNavigate();
    useEffect(()=>{
        if(course.status === COURSE_STATUS.PUBLISH){
            setValue("public",true)
        }
    },[])

    const back =()=>{
        dispatch((setStep(2)))

    }
      const goToCourse = ()=>{
        dispatch(resetCourse())
         Navigate("/dashboard/my-courses")
    }
       
    

    const handleCoursePublic = async()=>{
        if(course.status === COURSE_STATUS.PUBLISH &&
            getValues("public") === true ||
            course.status === COURSE_STATUS.DRAFT && getValues("public") ===false ){
                goToCourse()
                return;
            }else{
                const formData = new FormData();
                formData.append("courseId",course._id);
                
                const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISH : COURSE_STATUS.DRAFT;
                formData.append("status",courseStatus)
                 setLoading(true)
                const results = await EditCourse(formData,token)
                if(results){
                    goToCourse();
                }
                setLoading(false);
            }
    }

    const onSubmit = (data)=>{
        console.log("data",data)
        const results = handleCoursePublic();
        console.log("response",results)
    }
  return (
    <div>
       <h1 className="text-white text-xl mb-2">Publish Settings</h1>
       <div>
         <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="public" className="flex gap-2 items-center">
                <input
                    type="checkBox"
                    name="public"
                    id="public"
                    style={{ width: '20px', height: '20px' }}
                    {...register("public")}
                />
                <span className="text-white">Make this Course Public</span>
              </label>
             <div className="flex gap-5 mt-5">
              <button onClick={back}
               type="button"
               className="text-black bg-white rounded-md text-center py-4 px-4"
                disabled={loading}>
                back
              </button>
              <IconBtn type={"submit"} text="Save Changes" disabled={loading}>
              </IconBtn>
              </div>
         </form>
       </div>
    </div>
  )
}
export default PublishCourse;