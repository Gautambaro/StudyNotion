import React from 'react'
import HighlightText from '../HomePage/higlightText'

const Quote = () => {
  return (
    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
        We are passionate about revolutionizing the way we learn. Our
        innovative platform <HighlightText text={"combines technology"} />,{" "}
        <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
            {" "}
            expertise
        </span>
        , and community to create an
        <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
            {" "}
            unparalleled educational
        experience.
        </span> 
    </div>
  )
}

export default Quote


// import React from 'react'

// const  Oute=()=> {
//     const data= [
//         {
//             "heading":"5K",
//             "title":"Active Students",
//         },
//         {
//             "heading":"10+",
//             "title":"Mentors",
//         },
//         {
//            "heading":"200+",
//            "title":"Courses",
//         },
//         {
//             heading :"50+",
//             title:"Awards",
//         },
//     ]
//   return (
//   <div className=' bg-richblack-500 h-[254px]  mt-20 flex justify-center items-center'>
//     <div className=' flex gap-24 max-w-maxContent mx-auto'>
//         {
//             data.map((Element,index)=>{
//                 return(
//                     <div key={index} className='flex flex-col gap-3 items-center justify-center'>
//                         <p className='font-bold text-lg'>{Element.heading}</p>
//                         <p>{Element.title}</p>
//                     </div>
//                 )
//             })
//         }
//     </div>
// </div>
//   )
// }
// export default Oute;