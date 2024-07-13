
const express = require("express");
const router = express.Router();

const{
    updateProfile,
    deleteAccount,
    updateProfilePicture,
    getAllUserDetails,
    getEnrolledCourses,
    getInstructorDashboard
}=require("../controllers/profile");

const{contactUsController} =require ("../controllers/contactUs")
const{auth, isStudent}= require("../middlewares/Auth")

router.post("/updateProfile",auth,updateProfile);
router.post("/deleteAccount",auth,deleteAccount);
router.put("/updateProfilePicture",auth,updateProfilePicture);
router.get("/getAllUserDetails",auth, getAllUserDetails);
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.get("/getInstructorDashboard",auth,getInstructorDashboard);
router.post("/contactUs",contactUsController)
module.exports = router;