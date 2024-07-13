import React, {  useState } from 'react'
import{useForm} from "react-hook-form"
import IconBtn from '../../../../common/IconBtn';
import { IoAddCircleOutline } from "react-icons/io5"
import { useSelector,useDispatch } from 'react-redux';
import { MdNavigateNext } from "react-icons/md"
import {setCourse} from '../../../../../redux/slices/addCourseSlice';
import { setStep } from '../../../../../redux/slices/addCourseSlice';
import {setEditCourse} from '../../../../../redux/slices/addCourseSlice'
import NastedView from "./NestedView"
import {createSection, updateSection } from '../../../../../services/operations/course';
import toast from 'react-hot-toast';

 const CourseBuilderForm = () => {
  
  const dispatch = useDispatch();
   const{course} = useSelector((state)=>state.course);
   
   const{token} = useSelector((state)=>state.auth);
   const [editSectionName,setEditSectionName]= useState(null);
   const [loading,setLoading] = useState(false)
   
   const{
    register,
    handleSubmit,
    getValues,
    setValue,
    formState:{errors}
 }= useForm();
 
 const onsubmit = async(data)=>{
  setLoading(true)
  let results
  if(editSectionName){
    results = await updateSection({
      sectionName : data.sectionName,
      sectionId :editSectionName,
      courseId :course._id
    },token)
    console.log("results",results)
  }else{
    results = await createSection({
       sectionName:data.sectionName,
       courseId:course._id
    },token)
    console.log("results",results)
  }
  if(results){
    setEditSectionName(null)
    dispatch(setCourse(results))
    setValue("sectionName","")
    setLoading(false)
  }
}
    
    function cancelEdit(){
        setEditSectionName(null);
        setValue("SectionName","")
    }
    const handleChangeEditSectionName = (sectionId,sectionName)=>{
       if(editSectionName === sectionId){
        cancelEdit()
        return;
       }
       setEditSectionName(sectionId)
       setValue("sectionName",sectionName)
    }
    
   function goToNext(){
    if(course.courseContent.length===0){
      toast.error("plase add atleast one section")
      return;
    }
    if(course.courseContent.some((section)=>section.subSection.length === 0)){
      toast.error("plese add atleast on lecture")
      return;
    }else{
      dispatch(setStep(3))
    }
   }
   function GoBack(){
    dispatch(setEditCourse(true))
    dispatch(setStep(1))
    }
    

  return (
    <div>
           <form onSubmit={handleSubmit(onsubmit)}>
                <label htmlFor='courseBuilder'>Course Builder</label>
                <input
                    type='text'
                    name='courseBuilder'
                    id='courseBuilder'
                    className='text-black w-full h-10 rounded-md border-b border-richblack-100 mb-10'
                    placeholder='Add a section to create your course'
                    {...register("sectionName",{required:true})}
                />
                {
                  errors.sectionName && (
                        <span>
                            section name is required
                        </span>
                    )
                }
                <div>               
                <IconBtn
                text={editSectionName ? "updateSection":"create Section"}>
                <IoAddCircleOutline/>
                </IconBtn>
               {
                editSectionName  && (
                   <button className='text-black bg-yellow-200 mt-3 rounded-md py-3 px-3 '
                   type='button'
                   onClick={cancelEdit}>
                    cancel Edit
                   </button>
                )
               }
                </div>
 
           </form>

           {
           course.courseContent.length>0 &&(
              
              <NastedView handleChangeEditSectionName={handleChangeEditSectionName}/>
              
            )
           } 
           
           <div className='flex gap-5 mt-10'>
               <button
               onClick={GoBack}
               
               className='text-white bg-richblack-300 rounded-md text-center px-4 py-4' >
                  goBack
               </button>
               <IconBtn disabled={loading} text="Next" onclick={goToNext}>
               <MdNavigateNext/>
               </IconBtn>
           </div>
          
    </div>
  )
}
export default CourseBuilderForm;