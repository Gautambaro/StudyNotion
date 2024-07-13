import React from 'react'
import { FiTrash2 } from "react-icons/fi"
import  ConfirmationModal from "../../../common/confirmationModal"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount } from '../../../../services/operations/settings';
const Delete = () => {
  const [modal ,setModal] = useState(null);
  const{token}=useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  function handleClick(){
       deleteAccount(token);
  }
  return (
    <div className='my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12"'>
         <div className='flex items-start gap-2'>
         <div className='flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700'>
         <FiTrash2 className="text-3xl text-pink-200"/>
         </div>
         <div>
           <p className='text-white text-xl'>Delete Account</p>
           <p className='text-white'>you would to like to delete account?</p>
           <p className='text-white'>This account contains Paid Courses. deleting your account will remove all</p>
           <p className='text-white'> conatin associated with it</p>

           <div>
             <p  className="cursor-pointer text-pink-300 italic" onClick={ ()=>setModal({"text1":"Are you sure",
             btn1Handler: ()=>dispatch(handleClick),
             btn2Handler: ()=>setModal(null),
             })}>i want to delete my account</p>
           </div>
         </div>
         </div>
         {
          modal && (
            <div>
                 <ConfirmationModal 
                 data={modal}/>
            </div>
          )
         }
    </div>
  )
}
export default Delete;