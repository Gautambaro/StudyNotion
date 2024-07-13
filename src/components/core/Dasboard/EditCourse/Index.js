import React from 'react'
import { useSelector,useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';
import {getFullCourseDetails} from "../../../../services/operations/course";
import { setCourse } from '../../../../redux/slices/addCourseSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import { setEditCourse } from '../../../../redux/slices/addCourseSlice';
import RenderSteps from '../AddCourse/RenderStep';

 const EditCourse = () => {
    const dispatch = useDispatch();
    const[loading,setLoading]= useState(false);
     const{token} = useSelector((state)=>state.auth)
     const{course} = useSelector((state)=>state.course);
     console.log("course",course)
     const{step} = useSelector((state)=>state.course);
     const {courseId} = useParams();

    useEffect(()=>{
        const fetchCourseDetails=async()=>{
            setLoading(true);
            const results = await getFullCourseDetails(token,courseId);
            console.log("results",results);
            console.log("respone success")
            if(results){
             dispatch(setCourse(results.course));
             dispatch(setEditCourse(true))
             setLoading(false);
            }
        }
        fetchCourseDetails()
    },[courseId])
  console.log("step Edit Course",step)
    if(loading){
        return (
            <div className='grid flex-1 place-items-center'>
                <div className='spinner'>
                </div>
            </div>
        )
    }else{
   
        return (
            <div className='text-white w-[700px] mx-auto'>
                  <h1 className='text-3xl pb-10'>Edit Course</h1>
                  <div>
                    { 
                        course? (
                        
                       <RenderSteps/>
                      
                     ):
                     <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                           Course not found
                     </p>

                    } 
                  </div>
            </div>
          )
    }
  
}
export default EditCourse;