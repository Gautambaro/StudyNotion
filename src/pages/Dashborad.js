import React from 'react'
import { useSelector } from 'react-redux';
import  Sidebar  from '../components/core/Dasboard/Sidebar'
import { Outlet } from 'react-router-dom';

 const Dashborad = () => {
  
    const {loading:authLoading} = useSelector((state)=>state.auth);
    const {loading:profileLoading} = useSelector((state)=>state.profile);
     
    if(authLoading || profileLoading){
       <div className='w-14 h-14 rounded-full border-9 border-[#dbdcef] border-r-[#474bff] animate-spinner-d3wgkg'>

       </div>
    }
  return (
    <div className="flex min-h[calc(100vh-3.5rem)]">
         <Sidebar/>
         <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
               <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                 <Outlet/>
               </div>
         </div>
    </div>
  )
}

export default Dashborad;
