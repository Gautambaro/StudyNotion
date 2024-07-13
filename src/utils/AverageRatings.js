import React from 'react'

const AverageRatings = (ratingArr) => {
    console.log("ratingArr",ratingArr)
 if(ratingArr.length === 0) return 0

 
 const totalRiviewCount = ratingArr.reduce((acc,curr)=>{
    acc += curr.ratings
    return acc
 },0)

 const multiplier = Math.pow(10,1)
 const averageCount = Math.round(( totalRiviewCount/ ratingArr?.length) * multiplier) / multiplier

 return averageCount;
}
 
export default AverageRatings;