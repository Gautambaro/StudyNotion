import React from 'react'
import * as Icons from "react-icons/vsc"
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

 const SidebarLinks = ({link,iconName}) => {
 
     const location = useLocation();
     const path =location.pathname.split("/").at(-1);
     const linkPath = link.path.split("/").at(-1);
   
    const Icon = Icons[iconName];
  return (
    <div >
      <NavLink to={link.path}>
        <div className={`relative text-sm font-medium px-8 py-2 ${path === linkPath?" bg-yellow-800 text-yellow-50":
        "bg-opacity-0 text-richblack-300"} flex gap-3 transition-all duration-200`}>
        <span className={`absolute left-0 top-0 h-full w-[0.15rem] ${ path === linkPath?"bg-yellow-50":"bg-opacity-0"}`}></span>
           <Icon/>
           <p>{link.name}</p>
        </div>
      </NavLink>
    </div>
  )
}
export default SidebarLinks;