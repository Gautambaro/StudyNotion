const express = require("express");
const router = express.Router();

const{
  auth, isAdmin  ,isStudent,isInstructor
} = require("../middlewares/Auth");


const {createCategory,showAllCategories,categoryPageDetails} =require("../controllers/category");
router.post("/createCategory",auth, isAdmin ,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/categoryPageDetails",categoryPageDetails);


const{createCourse,getAllCourses,getCourseDetails,updateCourse,getInstructorCourse,deleteCourse,fullCourseDetails} = require("../controllers/Course");

router.post("/createCourse",auth,isInstructor,createCourse);
router.get("/getAllCourses",auth,getAllCourses);
router.post("/getCourseDetails",getCourseDetails);
router.post("/updateCourseDetails",auth,isInstructor,updateCourse);
router.get("/InstructorCourse",auth,isInstructor, getInstructorCourse);
router.post("/fullCourseDetails",auth,fullCourseDetails);
router.post("/deleteCourse",auth,isInstructor,deleteCourse);

const{createSection,SectionUpdate,deleteSection}= require("../controllers/Section");

router.post("/createSection",auth,isInstructor,createSection);
router.post("/SectionUpdate",auth,isInstructor,SectionUpdate);
router.post("/deleteSection",auth,isInstructor,deleteSection);

const{createSubsection,updateSubsection,deleteSubsection} = require("../controllers/subSection");

router.post("/createSubsection",auth,isInstructor,createSubsection);
router.post("/updateSubsection",auth,isInstructor,updateSubsection);
router.post("/deleteSubsection",auth,isInstructor,deleteSubsection);

const{createRatingsAndReviews,getAvergaeratings,getAllratings} = require("../controllers/reviews");

router.post("/createRatingsAndReviews",auth,isStudent,createRatingsAndReviews);
router.get("/getAvergaeratings",auth,getAvergaeratings);
router.get("/getAllratings",getAllratings);

const{UpdateCourseProgress} = require("../controllers/courseProgressCount");

router.post("/updateCourseProgress",auth,UpdateCourseProgress)

module.exports = router;