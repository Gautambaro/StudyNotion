import React from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import SidebarLinks from './SidebarLinks'
import { useState } from 'react'
import { VscSignOut } from "react-icons/vsc"
import ConfirmationModal from "../../common/confirmationModal"
import {useDispatch, useSelector} from "react-redux"
import {logout} from "../../../services/operations/Auth"
import { useNavigate } from 'react-router-dom'
 const Sidebar = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
const [showModal ,setShowModal] = useState (null);

const{user} = useSelector((state)=>state.profile)
console.log("accountType",user)
 
  return (
    <div className='text-white flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-richblack-700 py-10'>
     <div className='flex flex-col gap-5'>
         {
            sidebarLinks.map((element)=>{
                {
                  if(element.type  && element.type !== user.accountType){
                    return null;
                  }
                 
                  return(
                    <div key={element.id} className=''>
                        <SidebarLinks iconName={element?.icon} link={element} />
                    </div>
                    
                  )
                }
                
            })
         }
         {
            user.accountType === "Student" ? (<div>
            <SidebarLinks link={{name:"WishList",path:"/dashboard/WishList"}} iconName={"VscArchive"}/></div>)
            :(<div></div>)
         }
         
         </div>
         <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>
         <div className="flex flex-col gap-4 ">
         
         <SidebarLinks link={{name:"Settings",path:"dashboard/Settings"}} iconName={"VscSettingsGear"}/>
         <button onClick={()=>{
          setShowModal( {"text1":"are youSure","text2":"you will be logged out",
          btn1Handler: ()=>dispatch(logout(Navigate)) ,
          btn2Handler:()=>setShowModal(null),
          })
         }}>
           <div className="pl-8">
           <div className='flex gap-2 '>
           <VscSignOut className="text-lg" />
           <span>
            <p>LogOut</p>
           </span>
           </div>
           </div>
         </button>
         
         {
          showModal && (
            <div>
            <ConfirmationModal data={showModal}/>
            </div>
          )
         }
         </div>
    </div>
  )
}
export default Sidebar;