import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
const InstructionTag = ({register,setValue, getValues,name,id,errors}) => {
    const [instruction,setInstruction] = useState(" ");
    const [requirementList ,setRequirementList] = useState([])
     const {course,editCourse}= useSelector((state)=>state.course);

     useEffect(()=>{
        if(editCourse){
            setRequirementList(course.instructions)
        }
     },[])
    useEffect(()=>{
        register(name,{
            required:true,
        })
    },[])

  useEffect(()=>{
    setValue(name,requirementList)
  },[requirementList])
  
    function handleAddrequirement(){
            
            if(instruction){
                setRequirementList([...requirementList,instruction]);
            }
        }
    function removeHanlder(index){
        const updatedList = [...requirementList]
        updatedList.splice(index,1);
        setRequirementList(updatedList);
    }
  
    
  return (
    
    <div>
         <div className='flex flex-col'>
         <input
            type='text'
            name={name}
            id={id}
            className='text-black'
            value={instruction}
            onChange={(e)=>setInstruction(e.target.value)}
         />
         {
            errors[name] &&(
                <span>
                    plaese enter few instruction
                </span>
            )
         }
         </div>
         <button
          type='button' onClick={handleAddrequirement}>
            Add
         </button>
         {
        requirementList.length > 0 &&(
         <div className='text-white'>
        
         {
          
            requirementList.map((data,index)=>{
                return(
                    <div key={index} className=' flex gap-3'>
                         <span>{data}</span>
                        <button onClick={()=>removeHanlder(index)} className='text-white bg-richblack-400 rounded-md p-1'>
                              clear
                        </button>
                    </div>
                )
            })
         }
         </div>
         )
        }
    </div>
  )
}

export default InstructionTag;