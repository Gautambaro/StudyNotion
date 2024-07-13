 import React, { useEffect } from 'react'
 import { useParams } from 'react-router-dom';
 import { useState } from 'react';
 import { BiInfoCircle } from "react-icons/bi"
 import { HiOutlineGlobeAlt } from "react-icons/hi"
import {fetchCourseDetails} from "../services/operations/course";
import AverageRatings from "../utils/AverageRatings"
import  RatingStars from "../components/common/RatingStars";
import dateFormater from "../utils/DateString";
import  CourseDetailsCard from "../components/core/CourseCardVidew/courseDetailcard"
import Footer from "../components/common/footer"
import ConfirmationModal from '../components/common/confirmationModal';
import CourseAccordionBar from "../components/core/CourseCardVidew/courseAccordionBar";
import {buyCourse} from "../services/operations/Payment"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';



  const CourseDetails = () => {
     const [courseData,setCourseData] = useState(null);
     const [confirmationModal,setConfirmationModal] = useState(null)
     const [isActive, setIsActive] = useState(Array(0))
     const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
     const[rating,setRating] = useState(0);
     const{courseId} = useParams();
     const{token} = useSelector((state)=>state.auth)
     const{user} = useSelector((state)=>state.profile)
     const navigate = useNavigate();
     const dispatch = useDispatch();





     useEffect(()=>{
        const fetchcourseData = async()=>{
          const response = await fetchCourseDetails(courseId)
          setCourseData(response)
          const count = AverageRatings(response.courseDetails.ratingAndReview)
          setRating(count)

            let lectures = 0
            response.courseDetails.courseContent.forEach((sec) => {
              lectures += sec.subSection.length || 0
            })
            setTotalNoOfLectures(lectures)
          }
      
        fetchcourseData()
     },[courseId])
      
     console.log("response",courseData)


     const handleActive = (id) => {
      // console.log("called", id)
      setIsActive(
        !isActive.includes(id)
          ? isActive.concat([id])
          : isActive.filter((e) => e != id)
      )
    }
  
   
  
    const handleBuyCourse = () => {
      if (token) {
        buyCourse(token, [courseId], user, navigate, dispatch)
        return
      }
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      })
    }
  
  
     if(!courseData){
      return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      )
  
     }
  if(courseData){
    return (
    
      <div className='text-white'>
          
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={courseData.courseDetails.thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseData.courseDetails.Name}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseData.courseDetails.desciption}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{rating}</span>
                <RatingStars Review_Count={rating} Star_Size={24} />
                <span>{`(${courseData.courseDetails.ratingAndReview.length} reviews)`}</span>
                <span>{`${courseData.courseDetails.studentEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By {`${courseData.courseDetails.instructor.firstName} ${courseData.courseDetails.instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {dateFormater(courseData.courseDetails.createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. { courseData.courseDetails.price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={courseData.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <p className='text-white'>{courseData.courseDetails.whatWillYouLearn}</p>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseData.courseDetails.courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{courseData.totalDuration} total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseData.courseDetails.courseContent?.map((course, index) => (
               
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
                 
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    courseData.courseDetails.instructor.Image
                      ? courseData.courseDetails.instructor.Image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${courseData.courseDetails.instructor.firstName} ${courseData.courseDetails.instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${courseData.courseDetails.instructor.firstName} ${courseData.courseDetails.instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {courseData.courseDetails.instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal data={confirmationModal} />}
    </>

      </div>
    )
  }
  
 }
  export default CourseDetails;

