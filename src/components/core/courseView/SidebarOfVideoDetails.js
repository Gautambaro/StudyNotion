import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import IconBtn from '../../common/IconBtn';
import { IoIosArrowBack } from "react-icons/io"
import { BsChevronDown } from "react-icons/bs"
import { useLocation, useNavigate, useParams } from 'react-router-dom';


 const SidebarOfVideoDetails = ({setReviewModal}) => {
  const { totalNumberOfLecture, completedLecture, courseEntierData, courseSectionData } = useSelector((state) => state.courseView);
 console.log("completdlecture",completedLecture)
 console.log("courseEnteriredata",courseEntierData)
  const [videoBarActive, setVideoBarActive] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  useEffect(() => {
    const setActiveFlags = async () => {
      console.log("courseSectionData:", courseSectionData);

      if (!courseSectionData || !courseSectionData.length) {
        console.warn("No courseSectionData available.");
        return;
      }

      const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
      console.log("sectionId:", sectionId);
      console.log("currentSectionIndex:", currentSectionIndex);

      if (currentSectionIndex === -1) {
        console.warn("Section not found:", sectionId);
        window.location.reload();
        return;
      }

      const currentSection = courseSectionData[currentSectionIndex];
      console.log("currentSection:", currentSection);

      setActiveStatus(currentSection._id);

      if (!currentSection.subSection || !currentSection.subSection.length) {
        console.warn("No subSection available in current section.");
        window.location.reload();
        return;
      }

      const currentSubSectionIndex = currentSection.subSection.findIndex((subSection) => subSection._id === subSectionId);
      console.log("subSectionId:", subSectionId);
      console.log("currentSubSectionIndex:", currentSubSectionIndex);

      if (currentSubSectionIndex === -1) {
        console.warn("SubSection not found:", subSectionId);
        window.location.reload();
        return;
      }

      const activeSubSectionId = currentSection.subSection[currentSubSectionIndex]._id;
      console.log("activeSubSectionId:", activeSubSectionId);

      setVideoBarActive(activeSubSectionId);
    };

    if (courseSectionData && courseEntierData) {
      setActiveFlags();
    }
  }, [location.pathname, courseSectionData, courseEntierData, sectionId, subSectionId]);

  if (!courseEntierData  || !courseSectionData) {
    return <div className='spinner'></div>;
  }
  console.log("videoBar Active",videoBarActive)
  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntierData?.Name}</p>
            <p className="text-sm font-semibold text-richblack-500">
              { completedLecture?.length} / {totalNumberOfLecture}
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(course?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${
                      activeStatus === course?.sectionName
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntierData?._id}/section/${course?._id}/subSection/${topic?._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLecture.includes(topic._id)}
                        onChange={() => {}}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )

};

export default SidebarOfVideoDetails;
