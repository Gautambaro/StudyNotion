import React from "react";
import HighlightText from "../../../components/core/HomePage/higlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highliteText: "Anyone, Anywhere",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Studynotion partners with more than 275+ leading universities and companies to bring",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highliteText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;


// import React from "react";
// import HighlightText from "../HomePage/higlightText";
// import Button from "../HomePage/Button";

// const LearningGrid =()=>{
//     const data =[

//         {    "order":-1,
//              "text":"World-class Learning for",
//              "highlight":"Anyone Anywhere",
//              "para":"studyNotion partners withMore than 275+ leading universities and companies to bring flexible,afforadble,job-relevant online learning to individuals and orgenizations worldwide.",
//              "btnText":"Learn More",
//              "btnLink" :"/"
//         },
//         {
//             "order" :1,
//             "text" :"Curriculum based on Industry Needs",
//             "para" : "Save time and save money! The Belajar curriculum needs made to be easier to understand and in line with industry needs.",
//         },
//         {   
//              "order":2,
//             "text" :"Our Learning Method",
//             "para" :" The learning process uses the namely online and offline.",
//         },
//         {   
//             "order":3,
//             "text":"Certification",
//             "para":"you will get a certificate that can be used as a certification during job hunting."
//         },
//         {    
//             "order":4,
//             "text":`"Rating Auto-granding"`,
//             "para":"you will immediatley get feedback during the learning process without having to wait for an answer or response from the mentor",
//         },
//         {    "order":5,
//             "text":"Ready to Work",
//             "para":"Connected with over 150+ hiring partners you will have the opportunity to find a job after graduating from our program."
//         }
//     ]
//     return(
//         <div className="grid grid-col-1 lg:grid-cols-4 max-w-maxContent mx-auto  mt-20">
//              {
//                 data.map((Element,index)=>{
//                     return(
//                         <div key={index} className={`${index ===0 && "lg:col-span-2"}
//                         ${Element.order%2===1 ? "bg-richblack-700":"bg-richblack-800"}
//                         ${Element.order ===3 && "lg:col-start-2"}
//                         ${Element.order <0 && "bg-transparent"} `}>
//                            {
//                             Element.order < 0 ? (<div className="flex flex-col gap-3">
//                                <div>
//                                 <h1 className="text-3xl font-bold text-white">{Element.text}</h1>
//                                 <h1 className="text-3xl font-bold"> <HighlightText text={Element.highlight}/></h1>
//                                 </div>
//                                 <p className="w-[80%] text-richblack-200">{Element.para}</p>
//                                 <div className="w-fit mt-8">
//                                 <Button active={true} linkto={Element.btnLink}>
//                                    {Element.btnText}
//                                 </Button>
//                                 </div>
//                             </div>)
//                             :(<div className="flex flex-col justify-start items-start gap-7 pt-7 pb-3 pl-3 pr-3 h-[294px]">
//                                 <h1 className="font-bold text-xl w-[200px] text-white">{Element.text}</h1>  
//                                 <p className="text-richblack-200">{Element.para}</p>
//                             </div>)
//                            }
//                         </div>
//                     )
//                 })
//              }
//         </div>
//     )
// }
// export default LearningGrid;