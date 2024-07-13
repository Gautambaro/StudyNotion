const express = require("express");
const router = express.Router();

const {sendOtp,signUp,login,changePassword} = require("../controllers/Auth");
const {auth,isAdmin,isInstructor,isStudent} = require("../middlewares/Auth")

router.post("/sendOtp",sendOtp);
router.post("/signup",signUp);
router.post("/login",login);
router.post("/changePassword",auth,changePassword);

const {resetToken,resetPassword} = require("../controllers/ResetPassword")


router.post("/resetToken",resetToken);
router.post("/resetPassword",resetPassword);

module.exports =router;