import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { courseApi } from "../../services/api"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropDown from "../core/Auth/ProfileDropDown"

// const subLinks = [
//   {
//     title: "Python",
//     link: "/catalog/python",
//   },
//   {
//     title: "javascript",
//     link: "/catalog/javascript",
//   },
//   {
//     title: "web-development",
//     link: "/catalog/web-development",
//   },
//   {
//     title: "Android Development",
//     link: "/catalog/Android Development",
//   },
// ];

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItem } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET",courseApi.showAllCategories_api)
        console.log("res",res)
        setSubLinks(res.data.allTagDetails)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.course?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/WishList" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItem > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItem}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  )
}

export default Navbar









// import { Link } from "react-router-dom";
// import image from "../../assets/Logo/Logo-Full-Light.png"
// import { NavbarLinks } from "../../data/navbar-links";
// import {  useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import {getCategory} from "../../services/operations/course"
// import { useEffect, useState } from "react";
// import {IoIosArrowDropdownCircle} from "react-icons/io"
// import ProfileDropDown from "../core/Auth/ProfileDropDown"
// import { MdOutlineShoppingCart } from "react-icons/md";

// const Navbar = ()=>{
   
//     const {token} = useSelector((state)=>state.auth)
//     const {totalItem}= useSelector((state)=>state.cart)
//     const [loading,setLoading] = useState(false)
//     const loaction = useLocation();
//     const [subLinks ,setSubLinks] = useState([]);
    
    
//     const fetchSubLinks = async ()=>{
//         try{
//            setLoading(true)
//           const result = await getCategory()
//           console.log("results",result)
//             setLoading(false)
//           setSubLinks(result)
         
//         }catch(error){
//          console.log(error)
//         }
//     }

//     useEffect(()=>{
//         fetchSubLinks()
//     },[])

//     console.log("subLinks",subLinks)
//     return(
//         <div className="bg-richblack-800 border-b-[1px] border-b-richblack-700 ">
//              <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent mx-auto relative">
//                 <img src={image}/>
//                 <div className="flex gap-5">
//                 {
//                    NavbarLinks.map((element,index)=>(
//                     <nav>
//                         <div className="relative group flex items-center gap-2" key={index}>
//                             {
//                                 element.title === "Catalog" ? (<div className="flex gap-2 items-center">
//                                     <p className="text-richblack-300">Catalog</p>
//                                     <div className="bg-richblack-300 rounded-full">
//                                     <IoIosArrowDropdownCircle/>
//                                     </div>
//                                     <div className="invisible absolute left-[50%] translate-x-[-50%] translate-y-[80%] top-[50%]
//                                      flex flex-col items-center rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all
//                                      duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
//                                      <div className='absolute left-[50%] top-0
//                                       translate-x-[80%]
//                                       translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
//                                 </div>
//                                    {
//                                     loading ? (<p className="text-white">Loading...</p>) 
//                                     :( <div>
//                                         {
//                                             subLinks.filter((subLink)=> subLink.course.length > 0).map((sublink,i)=>(
//                                               <Link to={`/catalog/${sublink.name.split(" ").join("-").toLowerCase()}`} key={i}>
                                            
//                                                 <p className="rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50">{sublink.name}</p>
//                                               </Link>
//                                             ))
//                                         }
//                                     </div>)
//                                    } 
//                                     </div>
//                                 </div>):
//                                 (<div>
//                                     <Link to={element.path}>
//                                      <p className={`${loaction.pathname ===element.path ?"text-yellow-25":"text-richblack-100"}`}>{element.title}</p>   
//                                     </Link>
//                                 </div>)
//                             }
//                         </div>
//                     </nav>
//                    ))
//                 }
//                 </div>
//                 <div className="flex gap-2">
//                 {
//                   token === null && (
//                     <Link to={"/login"}>
//                         <button className="border border-richblack-700 bg-richblack-800
//                         px-[12px] py-[8px] rounded-md text-richblack-100">Login</button>
//                     </Link>
//                   )
//                 }
//                 {
//                     token === null && (
//                         <Link to={"/Signup"}>
//                            <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
//                             text-richblack-100 rounded-md">SignUp</button>
//                         </Link>
//                     )
//                 }
//                 {
//                     token !==null &&(
//                         <Link to={"dashboard/WishList"}>
//                         <div className=" flex items-cente">
//                         <div className="relative  text-richblack-300">
//                          <MdOutlineShoppingCart size={25} />
//                          </div>
//                          <div className="absolute transform translate-x-1/2 -translate-y-1/2
//                           font-extrabold text-pink-200 z-10 mt-2 ml-1">{totalItem}</div>
//                         </div>
//                         </Link>
//                     )
//                 }
//                 {
                    
//                     token !== null &&(
//                         <div>
//                             <ProfileDropDown/>
//                             </div>
//                     )
//                 }
//                 </div>
//              </div>
                 
//         </div>
//     )
// }
// export default Navbar;