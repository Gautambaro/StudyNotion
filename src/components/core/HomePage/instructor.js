import image from "../../../assets/Images/Instructor.png"
import HighlightText from "./higlightText";
import CTAButton from "./Button"
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = ()=>{
    return(
        <div className="flex flex-row gap-20 items-center justify-center text-white mx-auto w-11/12 max-w-maxContent ">
              <div className="mt-20 shadow-[-15px_-15px_0px_0px_rgba(255,255,255,1)]" >
                <img src={image} alt="instructorPhoto "/>
              </div>
                  <div className="flex flex-col gap-5 justify-center w-[70%] mt-9">
                    <div className="text-3xl flex flex-col">Become an <HighlightText text={"instructor"}/></div>
                      <p className="w-[60%]">Instructor from around the world teach millions of students on StudyNotion.
                       we provide the tools and skills to teach what you love
                      </p>
                        <div className="w-fit mt-6">
                          <CTAButton active={true} linkto={"/Singup"}>
                              <div className="flex flex-row gap-5">
                                  Start Teaching Today
                                   <FaArrowRight/>
                                     </div>
                                </CTAButton>
                        </div>
                  </div>
        </div>
    )
}

export default InstructorSection;