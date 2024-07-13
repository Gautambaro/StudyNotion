const mongoose= require('mongoose');
const {mailSender} = require("../utils/mailSender");
const {otpTemplate} = require("../mailTemplate.js/emailVerificationTemplate");

const OTPSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    OTP:{
        type:String,
        required:true,
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
        
    }
});
// Define a function to send emails
async function sendVerificationEmail(email,OTP) {
    console.log(email);
    console.log(OTP);
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			otpTemplate(OTP)
		);
		
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.OTP);
	}
	next();
});


module.exports = mongoose.model("OTP",OTPSchema);