import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/Logo-Small-Light.png"
import { setPaymentLoading } from "../../redux/slices/addCourseSlice";
import { resetCart } from "../../redux/slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    console.log("api",COURSE_PAYMENT_API)
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
         console.log("come upto here")
        //initiate the order
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer${token}`,
                                })
         
                              
        if(!orderResponse.data.success) {

            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);
        const amount = orderResponse.data.message.amount;
        //options
        const options = {
            key:process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(orderResponse) {
                //send successful wala mail
                sendPaymentSuccessEmail(orderResponse, amount,token );
                //verifyPayment
                verifyPayment({...orderResponse, courses}, token, navigate, dispatch);
            }
        }
     
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
       const mail= await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer${token}`
        })
       console.log("respone on mail",mail)
      
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        console.log("response on verify",response)
        toast.success("payment Successful you are addded to the course");
        dispatch(resetCart());
        navigate("/dashboard/enrolled-courses");
        
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}