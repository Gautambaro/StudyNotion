// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/paymentController")

console.log("capture mf",capturePayment);
console.log("verify",verifyPayment)
console.log("emailsend",sendPaymentSuccessEmail)
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/Auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router