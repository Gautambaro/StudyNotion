import { useState,useEffect } from "react";
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline
} from "react-icons/ti"


function RatingStars({Review_Count,Star_size}){
 const [starCount,setStarCount] = useState({
    full:0,
    half:0,
    empty:0,
 })
 
 useEffect(()=>{
    const wholestar = Math.floor(Review_Count) || 0
    setStarCount(
        {
            full:wholestar,
            half:Number.isInteger(Review_Count) ? 0 : 1,
            empty:Number.isInteger(Review_Count) ? 5-wholestar : 4-wholestar,
        }
    )
 },[Review_Count])

 
 return(
    <div className="flex gap-1 text-yellow-100">
          {[...new Array(starCount.full)].map((_, i)=>{
            return <TiStarFullOutline key={i} size={Star_size || 20}/>
          })}
          {[...new Array(starCount.half)].map((_,i)=>{
            return <TiStarHalfOutline key={i} size={Star_size ||20}/>
          })}

          {[...new Array(starCount.empty)].map((_,i)=>{
            return <TiStarOutline key={i} size={Star_size ||20}/>
          })}
    </div>
 )
}
export default RatingStars;