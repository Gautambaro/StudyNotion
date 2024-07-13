
import { useDispatch, useSelector } from "react-redux";
import useClickOutside from "../../../hooks/useClickOutside"
import { Link,useNavigate } from "react-router-dom";
import {useRef,useState} from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard } from "react-icons/vsc";
import { VscSignOut } from "react-icons/vsc";
import {logout}  from "../../../services/operations/Auth";

const ProfileDropDown =()=>{
const {user} = useSelector((state)=>state.profile);

const navigate =useNavigate();
const dispatch = useDispatch();
const [open,setOpen] = useState(false);
const ref= useRef(null);

useClickOutside(ref ,()=>setOpen(false));
if(!user){
    return null;
}

    return(
        
        <button className="relative z-[1]" onClick={()=>setOpen(true)} ref={ref} >
           <div className="flex gap-3 items-center gap-x-1">
              <img src={user?.Image} className="aspect-square w-[30px] rounded-full object-cover"/>
                  <div className="text-richblack-300">
                   <AiOutlineCaretDown  />
                   </div>
           </div>
           
           
              {
                open &&(
                    <div onClick={(e)=>e.stopPropagation()} className="absolute bg-richblack-500 rounded-md cursor-pointer">
                        <Link to="/dashboard/my-profile" onClick={()=>setOpen(false)}>
                        <div className="flex gap-2 mt-3 mb-3 ml-5 mr-5">
                        <div className="text-white ">
                        <VscDashboard />
                        </div>
                         <p className="text-white">DashBoard</p> 
                        </div>
                        </Link>
                        <div onClick={()=>{dispatch(logout(navigate)); setOpen(false)}} className="flex gap-2 mt-3 mb-3 ml-5 mr-5">
                         <div className="text-white">
                        <VscSignOut />
                        </div>
                        <p className="text-white">  Logout</p>
                        
                        </div>
                </div>
                )
              }
           
           </button>
        
    )
}

export default ProfileDropDown;