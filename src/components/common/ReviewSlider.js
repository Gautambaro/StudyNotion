

import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import{ratingApiEndpoints} from "../../services/api";

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingApiEndpoints.getAllratings_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

   console.log(reviews)

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-[1200px]"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 mx-auto">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 ">
                    <h3 className="font-semibold text-yellow-100">
                      {review.ratings.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.ratings}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider



// import React, { useState } from 'react'
// import{ratingApiEndpoints} from "../../services/api";
// import { apiConnector } from '../../services/apiConnector';
// import { useEffect } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/pagination';
// import { FreeMode, Pagination, Autoplay } from 'swiper/modules';


// import RatingStars from './RatingStars';



//  const ReviewSlider = () => {
//   const [review,setReview] = useState([]);

//     useEffect(()=>{
//      const getAllreview = async ()=>{
//         const response = await apiConnector("GET",ratingApiEndpoints.getAllratings_API)
//         if(response){
//             console.log("response",response)
//             setReview(response.data.data)
//         }
//      }
//      getAllreview();
//     },[])
//   return (
//     <div>
     
//          <div className='w-[1200px]'>
//             review && (
//             <div>
//                 <Swiper
//                  slidesPerView={4}
//                     spaceBetween={24}
//                     loop={true}
//                     freeMode={true}
//                     autoplay={{
//                         delay: 2500,
//                     }}
//                     modules={[FreeMode, Pagination, Autoplay]}
//                     className='w-full'

//                 >
//                     {review.map((review, index) => (
//                         <SwiperSlide key={index}>
//                             <div className='bg-richblack-600 flex flex-col gap-4 px-auto w-[350px]'>
//                                 <div className='flex gap-3 text-white'>
//                                     <img src={review.user.Image} alt={`${review.user.firstName}'s profile`} className='w-[50px] h-[50px] rounded-full' />
//                                     <div className='flex flex-col gap-2'>
//                                         <p>{review.user.firstName + " " + review.user.lastName}</p>
//                                         <p>{review.user.email}</p>
//                                     </div>
//                                 </div>
//                                 <p className='text-white'>{review.review}</p>
//                                 <div className='flex gap-2 text-white'>
//                                     <p>{review.ratings}</p>
//                                     <RatingStars Review_Count={review.ratings}/>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         )
//          </div>
      
//     </div>
//   )
// }
// export default ReviewSlider;