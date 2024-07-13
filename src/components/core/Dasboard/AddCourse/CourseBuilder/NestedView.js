import React from 'react'
import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { RxDropdownMenu } from "react-icons/rx"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import {deleteSection} from "../../../../../services/operations/course"
import { deleteSubSection} from "../../../../../services/operations/course"
import ConfirmationModal from "../../../../common/confirmationModal"
import { setCourse } from '../../../../../redux/slices/addCourseSlice';
import SubSectionModal from './SubSectionModal';

const NastedView = ({handleChangeEditSectionName}) => {
  const [confirmationModal,setConfirmationModal] = useState(null);
  const[addSubSection,setAddSubSection] = useState(null);
  const[editSubSection,setEditSubSection]= useState(null);
  const[viewSubSection,setViewSubSection] =useState(null);
  
  const{course} = useSelector((state)=>state.course)
  
  const{token} =useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  async function handleDeleteSection(sectionId){
    const results = await deleteSection({
      sectionId,
      courseId : course._id,
    
    }, token)
    if(results){
      dispatch(setCourse(results))
    }
    setConfirmationModal(null)
  }
  async function subSectioDeletehandler(subSectionId,sectionId){
   const results = await  deleteSubSection({
    subSectionId,
    sectionId,
   },token)
   if(results){
    const updatedCourse = course.courseContent.map((section)=>(
      sectionId === section._id ? results : section
    ))
    const updatedCourseContent = {...course, courseContent:updatedCourse}
    dispatch(setCourse(updatedCourseContent));
    setConfirmationModal(null)
   }
  }
  return (
    <div className='bg-richblack-600 mt-5 rounded-md'>
         <div>
            {
              course.courseContent.map((section,index)=>{
                  return(
                    <details key={index} open>
                        <summary className='flex justify-between border-b border-richblack-50 mx-6'>
                          <div className='flex gap-x-3 items-center py-3 px-3 '>
                                <RxDropdownMenu size={20}/>
                                <p className='text-white text-xl'>{section.sectionName}</p>
                          </div>
                          <div className='flex items-center gap-x-3'>
                             <button onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                                <MdEdit className='text-xl text-richblack-300'/>
                             </button>
                             <button onClick={()=>{
                              setConfirmationModal({
                                text1:"Delete this section",
                                text2:"all the lectures in this section will be deleted",
                                btn1Handler:()=> handleDeleteSection(section._id),
                                btn2Handler:()=> setConfirmationModal(null)
                              })
                             }}>
                               <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                             </button>
                             <span className="font-medium text-richblack-300">|</span>
                             <AiFillCaretDown className={`text-xl text-richblack-300`}/>
                          </div>
                        </summary>
                        <div className='px-6 pb-4'>
                           {
                            section.subSection.map((data,index)=>{
                               return(
                                <div key={index} onClick={()=>setViewSubSection(data)} 
                                className='cursor-pointer flex justify-between mt-4 border-b border-richblack-50 mx-6'>
                                  <div className='flex gap-2 items-center '>
                                    <RxDropdownMenu size={20}/>
                                    
                                    <p className='text-white text-xl'>{data.title}</p>
                                  </div>
                                  <div onClick={(e)=>e.stopPropagation()} className='flex gap-2'>
                                    <button onClick={()=>setEditSubSection({...data,sectionId:section._id})}>
                                       <MdEdit className='text-xl text-richblack-300'/>
                                    </button>
                                    <button onClick={()=>setConfirmationModal({
                                      text1:"are you sure",
                                      text2:"lecture sill be deleted",
                                      btn1Text:"delete",
                                      btn2text:"cancel",
                                      btn1Handler:()=>subSectioDeletehandler(data._id,section._id,),
                                      bt2Handler:()=>setConfirmationModal(null)
                                    })}>
                                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>
                                  </div>
                                </div>
                               ) 
                            })
                           }
                           <button onClick={()=>setAddSubSection(section._id)}
                           className="mt-3 flex items-center gap-x-1 text-yellow-50">
                           <FaPlus className="text-lg" />
                           <p>Add Lecture</p>
                           </button>
                        </div>
                    </details>
                  )
              })
              
            }

         </div>
        {
          addSubSection && (
            <SubSectionModal
              modalData={addSubSection}
              setModalData={setAddSubSection}
              add={true}
            />
          )
        }
         {
          viewSubSection && (
            <SubSectionModal
              modalData={viewSubSection}
              setModalData={setViewSubSection}
              view={true}
            />
          )
         }
         {
          editSubSection && (
            <SubSectionModal
              modalData={editSubSection}
              setModalData={setEditSubSection}
              edit={true}
            />
          )
         }{
          confirmationModal && (
            <ConfirmationModal
              data={confirmationModal}
            />
          )
         }
    </div>
  )
}
export default NastedView;