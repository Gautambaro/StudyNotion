import React, { useState,useRef,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { FiUpload } from "react-icons/fi"
import {updateProfilePic} from "../../../../services/operations/settings";
import IconBtn from '../../../common/IconBtn';

const ChangeProfilepic = () => {

 const [imageFile, setImageFile] = useState(null);
 const [loading, setLoading] = useState(false)
 const [previewSource, setPreviewSource] = useState(null);
 const {token}= useSelector((state)=>state.auth)
 

 const FileInputRef = useRef(null);
 const dispatch = useDispatch();

 const {user} =useSelector((state)=>state.profile);
 
 function handleOnChange(e){
   const file = e.target.files[0]
   
   if(file){
       setImageFile(file);
       preview(file)
   }
}
 function onClickHandler(){
    FileInputRef.current.click()
 }
 
function preview(file){
   const reader = new FileReader();
   reader.readAsDataURL(file)
   reader.onloadend=()=>{
      setPreviewSource(reader.result)
   }
}
useEffect (()=>{
  if(imageFile){
    preview(imageFile)
  }
},[imageFile])

const handleFileUpload =()=>{
    try{
     setLoading(true)
     const formData = new FormData();
     formData.append("imageFile",imageFile)
     console.log("form",formData)
     dispatch(updateProfilePic(token,formData)).then(()=>{
      setLoading(false)
     })
    }catch(error){
      console.log(error)
    }
}
console.log("ref",FileInputRef)
  return (
    <div className='my flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5'>
       
           <div className='flex justify-center items-center gap-5'>
             <div>
              <img src= {previewSource || user?.Image  } className='w-[100px] h-[100px] rounded-full'/>
              </div>
              <div className='flex flex-col items-start justify-start'>
              <h1 className='text-white'>Change Profile picture</h1>
                 <div className=' flex flex-col gap-3 '>
                 
                     <input
                        type='file'
                        ref={FileInputRef}
                        onChange={handleOnChange}
                        className='opacity-0'
                        accept='image/png, image/gif, image/jpeg '
                     />
                     <div className='flex gap-3'>
                     <button
                     onClick={onClickHandler}
                     disabled={loading}
                      className='cursor-pointer text-center rounded-md 
                       bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                           '>
                        Select
                     </button>
                 
                 <IconBtn text={loading? "uploading":"upload" } onclick={handleFileUpload} className="flex gap-1">
                  {
                     !loading &&(
                        <FiUpload className='text-lg text-richblack-900 '/>
                     )
                  }
                     
                 </IconBtn>
                 </div>
                 </div>
              </div>
           </div>
           
    </div>
  )
}
export default ChangeProfilepic;