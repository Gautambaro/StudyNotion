import React from 'react'
import { Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';
import CourseReviewModal from '../components/core/courseView/CourseReviewModal';
import SidebarOfVideoDetails from '../components/core/courseView/SidebarOfVideoDetails';
import { useEffect } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import { getFullCourseDetails } from '../services/operations/course';
import {setCourseEntierData,setCourseSectionData,setCompletedLecture,setTotalNumberOfLecture} from "../redux/slices/courseView"

 const ViewCourse = () => {
    const [reviewModal,setReviewModal] = useState(false);
     const dispatch = useDispatch();
    const{token}= useSelector((state)=>state.auth)
    const {courseId} = useParams();

    useEffect(()=>{
      const courseData = async()=>{
        try{
          const apiResponse = await getFullCourseDetails(token,courseId);
          console.log("apiResponse",apiResponse)
           if(apiResponse){

            dispatch(setCourseSectionData(apiResponse.course.courseContent))
            dispatch(setCourseEntierData(apiResponse.course))
            dispatch(setCompletedLecture(apiResponse.completedVideos))

            let lectureCount =0;
             apiResponse.course.courseContent.forEach((section)=>{
              lectureCount += section.subSection.length
            })
            dispatch(setTotalNumberOfLecture(lectureCount))
           }
        }catch(error){
          console.log(error)
        }
      }
      courseData();
    },[])
    
    return (
      <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <SidebarOfVideoDetails setReviewModal={setReviewModal} />
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
            <div className="mx-6">
              <Outlet />
            </div>
          </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      </>
    )
  
}
export default ViewCourse;