
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Tagcomp = ({register,setValue,name,id,errors}) => {
    
 
 const [inputValue,setInputValue] = useState("")
 const [renderList,setRenderList] = useState([])
 const {editCourse,course} = useSelector((state)=>state.course)

 useEffect(()=>{
    if(editCourse){
        setRenderList(course.tags)
    }
 },[])
useEffect(()=>{
    register(name,{
        required:true
    })
})
useEffect(()=>{
    setValue(name,renderList)
})
 function onKeyDownHandler(event){
     if(event.key === 'Enter'|| event.key ===','){
      event.preventDefault();
      if(inputValue){
        setRenderList([...renderList,inputValue]);
        setInputValue("")
      }
     }
 }
 function removehandler(index){
   const updatedList = [...renderList];
    updatedList.splice(index,1)
    setRenderList(updatedList)
 }
 
  return (
    <div>
    <div className='text-white' >
        {
            renderList.map((element,index)=>{
            return(
                <div className='flex gap-3' >
                 <span className='text-yellow-300 bg-richblack-400 rounded-md mx-4 my-2 w-fit p-4' >{element}</span> 
                   <span className='text-yellow-200 cursor-pointer' onClick={()=>removehandler(index)}>X</span>
                </div>
            )
           })
        }
    </div>
       
     <input
            type='text'
            name={name}
            id={id}
            className='text-black w-full h-10 rounded-md pl-3'
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
            onKeyDown={onKeyDownHandler}
         />  
         {
            errors[name] &&(
                <span>
                    enter tag
                </span>
            )
         }
        

    </div>
  )
}
export default Tagcomp;