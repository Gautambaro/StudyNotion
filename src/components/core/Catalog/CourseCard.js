
import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/AverageRatings"
import RatingStars from "../../common/RatingStars"

function Course_Card({ course, Height }) {
 
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReview)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.Name}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card







// import React, { useEffect, useState } from 'react'
// import RatingStars from "../../common/RatingStars"
// import  AverageRatings from "../../../utils/AverageRatings";
// import { Link } from 'react-router-dom';

//  const CategoryCard = ({course,Height}) => {
//   console.log("course",course)
//   const [averageCount,setAverageCount] = useState(0);
  
//   useEffect(()=>{
//     if(course && course.ratingAndReview){
//         const count = AverageRatings(course.ratingAndReview);
//         setAverageCount(count)
//     }
    
//   },[course])
 
//   return (
//     <div>
//         <Link to={`/courses/${course._id}`}>
//             <div>
//                 <div>
//                     <img 
//                         src={course?.thumbnail}
//                         alt='course ka thumbnail'
//                         className={`${Height} w-full rounded-xl object-cover`}
//                     />
//                 </div>
//                 <div>
//                     <p className='text-white'>{course?.Name}</p>
//                     <p className='text-white'>{course?.instructor?.firstName +" "+course?.instructor?.lastName} </p>
//                     <div className='flex gap-x-3'>
//                         <span>{averageCount}</span>
//                         <RatingStars Review_Count={averageCount} />
//                         <span>{course?.ratingAndReviews?.length} Ratings</span>
//                     </div>
//                     <p>{course?.price}</p>
//                 </div>
//             </div>
//         </Link>

      
//     </div>
//   )
// }
//  export default CategoryCard;