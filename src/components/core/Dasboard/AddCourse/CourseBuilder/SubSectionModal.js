import React, { useState } from 'react'
import {useForm} from "react-hook-form";
import { useEffect } from 'react';
import { RxCross2 } from "react-icons/rx"
import Upload  from '../Upload'
import toast from 'react-hot-toast';
import IconBtn from '../../../../common/IconBtn';
import { setCourse } from '../../../../../redux/slices/addCourseSlice';
import { useSelector,useDispatch } from 'react-redux';
import {createSubSection, updateSubSection } from '../../../../../services/operations/course';
 
 const SubSectionModal = ({modalData,setModalData,add=false,view=false,edit=false,}) => {
    
    const[loading,setLoading] =useState(false)
   useEffect(()=>{
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

   
   const dispatch =useDispatch();
    const{token}=useSelector((state)=>state.auth);
   const{course} = useSelector((state)=>state.course);
    const {register,setValue,getValues,handleSubmit,formState:{errors}} =useForm();
    
    function handleClose(){
      setModalData(null)
    }
     function isFormUpdated() {
      const currentCourse = getValues();
      if (
        currentCourse.lectureTitle !== modalData.title ||
        currentCourse.lectureDesc !== modalData.description ||
        currentCourse.lectureVideo !== modalData.videoUrl
      ) {
        return true;
      } else {
        return false;
      }
    }
    async function handleEditSubSection(){
      const currentValues= getValues();
      const formData = new FormData();
      formData.append("SectionId",modalData.sectionId)
      formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)

     }
    const onSubmit = async(data)=>{
      if(view){
        return;
      }
      if(edit){
        if(!isFormUpdated()){
          toast.error("no changes made so far")
        }else{
          handleEditSubSection()
        }
        return;
      }
      const formData = new FormData();
      console.log("modal data",modalData)
      formData.append("SectionId",modalData);
      formData.append("title",data.lectureTitle);
      formData.append("description",data.lectureDesc)
      formData.append("videoFile",data.lectureVideo);
      setLoading(true)

       const result = await createSubSection(formData,token)
       console.log("results",result)
       if(result){
        const updatedCourseContent = course.courseContent.map((section)=>(
          section._id === modalData ? result : section
        ))
        const updatedCourse = {...course,courseContent:updatedCourseContent}
        console.log("updated course",updatedCourse)
        dispatch(setCourse(updatedCourse))
      }
      setModalData(null)
      setLoading(false)

    }
  return (
    <div className=' fixed inset-0 z-[1000] !mt-0 h-screen w-screen place-itesm center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
    <div className='my-10 w-11/12 max-w-[700px] rounded-lg text border border-richblack-400 bg-richblack-800'>
       <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
           <p className='text-white'>
           
           {add && "adding" } {view && "viewing"} {edit && "editing"} lecture
          
           </p>
           <button onClick={handleClose}>
             <RxCross2 className='text-2xl text-richblack-5'/>
           </button>
       </div>
       <form onSubmit={handleSubmit(onSubmit)} >
           <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}

           />
           <div>
             <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                 Lecture Title {!view && <sup className="text-pink-200">*</sup>}
             </label>
             <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full text-black"
            />
              {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
           </div>
           <div className="flex flex-col space-y-2">
           <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full text-black"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}

           </div>
           {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}

       </form>
    </div>
    </div>
  )
}
export default SubSectionModal;