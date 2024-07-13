import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// import "../../.."
// Import required modules
import { FreeMode, Pagination } from "swiper/modules"

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
import Course_Card from "./CourseCard"

function Course_Slider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider






// import React from 'react'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/autoplay';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// import CategoryCard from "./CourseCard"

//  const CourseSlider = ({Course}) => {

//   return (
//     <div>
//       {
//         Course?.length > 0 ? (
//           <Swiper
//           slidesPerView={1}
//           loop={true}
//           spaceBetween={200}
//           pagination={true}
//           modules={[Autoplay,Pagination,Navigation]}
//           className='mySwiper'
//           autoplay={{
//             delay:1000,
//             disableOnInteraction:false,
//           }}
//           navigation={true}
//           breakpoints={{
//             1024:{slidesPerView:3,}
//           }}
//           >
//           {
//             Course.map((course,index)=>(
//              <SwiperSlide key={index}>
//                   <CategoryCard course={course} Height={"h-[250px]"}/>
//              </SwiperSlide> 
//             ))
//           }
//         </Swiper>) :(<>
//           <p className='text-white'>Course not found</p>
//         </>)
//       }
//     </div>
//   )
// }
// export default CourseSlider;