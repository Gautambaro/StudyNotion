import React, { useEffect } from 'react'
import {useSelector,useDispatch} from "react-redux";
import { RiEditBoxLine } from "react-icons/ri"
import { useNavigate } from 'react-router-dom';
import {userDetalis} from "../../../services/operations/Profile"
import IconBtn from '../../common/IconBtn';

 const Profile = () => {
    const {user} = useSelector((state)=>state.profile) ;
   
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
   const dispatch = useDispatch();
   
    
   console.log("user",user)
   useEffect(()=>{
      dispatch(userDetalis(token))
   },[])
    
     
  return (
    <div className='w-11/12 max-w-maxContent mx-auto'>
      
        <h1 className='mb-14 text-3xl font-medium text-richblack-5 mt-10'>My Profile</h1>
        <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
             <div className='flex items-center gap-x-4'>
                 |<img src={user.Image} className="aspect-square w-[78px] rounded-full object-cover"/>
                  <div className='space-y-1'>
                      <h1 className='text-lg font-semibold text-richblack-5'>{user.firstName + user.lastName}</h1>
                      <p className='text-sm text-richblack-300'>{user.email}</p>
                  </div>
             </div>
             <IconBtn
             text="Edit" onclick={()=>navigate("/dashboard/Settings")}>
             <RiEditBoxLine />
             </IconBtn>
        </div>
        
        <div className='my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
              <div className='flex w-full items-center justify-between'>
                 <h1 className='text-lg font-semibold text-richblack-5'>About</h1>
                 <p className='text-sm font-medium text-richblack-5'>{user?.additionalDetails?.about}</p>
                 <IconBtn
                text="Edit"
                 onclick={() => {
                navigate("/dashboard/settings")
               }}
          >
            <RiEditBoxLine />
          </IconBtn>
          </div>
              </div>
              <div className='my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
              <div className="flex w-full items-center justify-between">
               <p className="text-lg font-semibold text-richblack-5">
               Personal Details
               </p>
             <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

                 <div className='flex max-w-[500px] justify-between'>
                  <div className='flex flex-col gap-5'>
                    <div>
                       <p className='mb-2 text-sm text-richblack-600'>First Name</p>
                       <p className='text-sm font-medium text-richblack-5'>{user?.firstName}</p>
                    </div>
                    
                   <div>
                   <p className="mb-2 text-sm text-richblack-600">Email</p>
                     <p className="text-sm font-medium text-richblack-5">
                    {user?.email}
                  </p>
                  <div>
                      <p className='mb-2 mt-4 text-sm text-richblack-600'>Gender</p>
                      <p className='text-sm font-medium text-richblack-5'>{user?.additionalDetails?.gender}</p>
                    </div>
                 </div>
                 </div>
                 <div className='flex flex-col gap-y-5'>
                 
                  <div>
                       <p className='mb-2 text-sm text-richblack-600'>Last Name</p>
                       <p className='text-sm font-medium text-richblack-5'>{user?.lastName}</p>
                    </div>
                    <div>
                      <p className='mb-2 text-sm text-richblack-600'>Date of Birth</p>
                      <p className='text-sm font-medium text-richblack-5'>{user?.additionalDetails?.DateOfBirth}</p>
                    </div>
                 <div>
                    <p className='mb-2 text-sm text-richblack-600'>Phone Number</p>
                    <p className='text-sm font-medium text-richblack-5'>{user?.additionalDetails?.contact}</p>
                 </div>
               
                
                 </div>
             
              </div>
              </div>
            
    </div>
  )
}
export default Profile;