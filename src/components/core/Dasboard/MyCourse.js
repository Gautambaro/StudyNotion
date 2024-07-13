import  { useEffect } from 'react'
import IconBtn from '../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import {instructorCourses} from "../../../services/operations/course"
import { useSelector } from 'react-redux';
import { useState } from 'react';
import TableCourse from "./InstructorCourse/Coursetable"


 const Courses = () => {
 const navigate = useNavigate()
 const [courses,setCourses] = useState([]);
 const{token} = useSelector((state)=>state.auth);
 
useEffect(()=>{
  const getInstructorCourses = async()=>{
    const results = await  instructorCourses(token)
    if(results){
      console.log("response",results)
      setCourses(results)
      
    }
   }
   getInstructorCourses()
},[])
 
  function CourseAddHandler(){
     navigate("/dashboard/add-course")
  }
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-white'>My Course</h1>
        <IconBtn text="Add Course" onclick={CourseAddHandler}/>
      </div>
        <TableCourse courses={courses} setCourses={setCourses}/>
    </div>
  )
}
export default Courses;