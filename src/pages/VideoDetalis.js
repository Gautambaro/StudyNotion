import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { Player } from 'video-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "video-react/dist/video-react.css"
import { useNavigate } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import { BigPlayButton } from "video-react"
import { setCompletedLecture } from '../redux/slices/courseView';
import { courseProgress} from "../services/operations/course"
import {useDispatch} from 'react-redux';


 const VideoDetalis = () => {
  const { courseSectionData,courseEntierData, completedLecture} = useSelector((state)=>state.courseView);
  const{token} = useSelector((state)=>state.auth)
   const [videoData,setVideoData] = useState("");
   const [videoEnded,setVideoEnded] = useState(false);
   const [loading,setLoading] = useState(false)
   const [previewSource, setPreviewSource] = useState("")
  const {sectionId,subSectionId,courseId} = useParams();

   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const PlayerRef = useRef();

    console.log("courseSectionData",courseSectionData)
    console.log("sectionId",sectionId)
    console.log("subSection",subSectionId)

   useEffect(()=>{
    const setVideoSpecificDetails = ()=>{
      
      if( !courseSectionData || !courseSectionData?.length){
        return;
      }
       
      if(!courseId && !sectionId && !subSectionId){
        
          navigate("/dashboard/enrolled-courses")
      }else{
        const filteredSection =   courseSectionData.filter((section)=>
          section._id === sectionId
      )
       console.log("filteredSection", filteredSection);

        const filteredSubSection =   filteredSection[0].subSection.filter((subSection)=>
        subSection._id === subSectionId
       )
       
       setVideoData(filteredSubSection[0])
      } 
    }
    setVideoSpecificDetails();
   },[courseSectionData,courseEntierData,location.pathname])

   const firstVideo =()=>{
      const currentSectionIndex = courseSectionData.findIndex((section)=>
        section._id === sectionId
      )
      const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection)=>
        subSection._id === subSectionId
      )

      if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
        return true;
      }else{
        return false;
      }
   }


   const LastVideo=()=>{
    const currentSectionIndex = courseSectionData.findIndex((section)=>
      section._id === sectionId
    )
    console.log("currentSectionIndex",currentSectionIndex)

    const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length
   
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((sub)=>
        sub._id === subSectionId
    )
    if( currentSectionIndex === courseSectionData.length -1 &&  currentSubSectionIndex === noOfSubSection-1){
       return true;
      }else{
        return false;
      }
   }

   const GOtoNext =()=>{
     const currentSectionIndex = courseSectionData.findIndex((section)=>
       section._id === sectionId
     )
     const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;
     const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((subSection)=>
      subSection._id === subSectionId
     )
     

     if(currentSubSectionIndex != noOfSubSection-1){
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex +1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/subSection/${nextSubSectionId}`)

     }else{
      const nextSectionId = courseSectionData[currentSectionIndex +1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex +1].subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSectionId}/subSection/${nextSubSectionId}`)

     }
   }
  
   const goTOPrevious =()=>{
     const currentSectionIndex  = courseSectionData.findIndex((section)=>
       section._id === sectionId
     )
     const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length
     const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((sub)=>
       sub._id === subSectionId
     )
     if(currentSubSectionIndex != 0){
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/subSection/${prevSubSectionId}`)
     }else{
      //move to different prev section first video
       const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
       const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length
       const prevSubSectionId = courseSectionData[currentSectionIndex-1].subSection[prevSubSectionLength - 1]._id
       navigate(`/view-course/${courseId}/section/${prevSectionId}/subSection/${prevSubSectionId}`)
       
     }
   }
  const handleLectureComplete =async()=>{
      console.log("im inside function")
      console.log("courseId",courseId)
       const response = await courseProgress({courseId,subSectionId},token)
       console.log("respnse",response)
       if(response){
        dispatch(setCompletedLecture(subSectionId))
      }

   }
    
  console.log("videoEnded",videoEnded)

   return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={PlayerRef}
          style={{ aspectRatio: "16:9" }}
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLecture.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureComplete()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (PlayerRef?.current) {
                    // set the current time of the video to 0
                    PlayerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!firstVideo() && (
                    <button
                  disabled={loading}
                  onClick={() => {
                    goTOPrevious();
                    setVideoEnded(false);
                  }}
                  className="blackButton"
                >
                  Prev
                </button>
                )}
                {(videoEnded && !LastVideo()) && (
                <button
                  disabled={loading}
                  onClick={()=>{
                    GOtoNext();
                    setVideoEnded(false)
                  }}
                  className="blackButton"
                >
                  Next
                </button>
              )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )

}
export default VideoDetalis;