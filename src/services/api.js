const baseUrl = process.env.REACT_APP_BASE_URL


//auth endpoints
export const Auth = {
    SendOTP_API : baseUrl + "/Auth/sendOtp",
    Signup : baseUrl + "/Auth/signUp",
    Login: baseUrl + "/Auth/login",
    resetToken: baseUrl + "/Auth/resetToken",
    resetPassword: baseUrl + "/Auth/resetPassword",
    changePassword : baseUrl + "/Auth/changePassword",
    
}

// profile endpoints
export const profileApi = {
   getUserDeatails: baseUrl + "/profile/getAllUserDetails",
   getUserEnrolledCourse: baseUrl + "/profile/getEnrolledCourses",
   updateProfilePic: baseUrl + "/profile/updateProfilePicture",
   updateProfileDetails : baseUrl + "/profile/updateProfile",
   getInstructorDashboard :baseUrl + "/profile/getInstructorDashboard",
   contactUsApi: baseUrl+ "/profile/contactUs"
}


// cousre EndPoint

export const courseApi ={
    //admin
    create_category_api : baseUrl + "/course/createCategory",
    showAllCategories_api : baseUrl + "/course/showAllCategories",
    categoryPageDetails_api : baseUrl + "/course/categoryPageDetails",

    // instructor
    
    createCourse_api : baseUrl + "/course/createCourse",
    updateCourse_api : baseUrl + "/course/updateCourseDetails",
    deleteCourse_api : baseUrl + "/course/deleteCourse",
    createSection_api: baseUrl + "/course/createSection",
    updateSection_api : baseUrl + "/course/SectionUpdate",
    deleteSection_api : baseUrl + "/course/deleteSection",
    createSubsection_api : baseUrl + "/course/createSubsection",
    updateSubsection_api : baseUrl + "/course/updateSubsection",
    deleteSubSection_api :baseUrl + "/course/deleteSubsection",
    getCourseDetails_api : baseUrl +"/course/getCourseDetails",
    getAllCourse_api : baseUrl + "/course/getAllCourses",
    getInstructorCourse_api : baseUrl + "/course/InstructorCourse",
    fullCourseDetails_api : baseUrl + "/course/fullCourseDetails",
    updateCourseProgressApi : baseUrl + "/course/updateCourseProgress"
}

export const studentEndpoints = {
  COURSE_PAYMENT_API: baseUrl + "/payment/capturePayment",
  COURSE_VERIFY_API:  baseUrl + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: baseUrl + "/payment/sendPaymentSuccessEmail",
}

export const ratingApiEndpoints ={
  createRating_API : baseUrl + "/course/createRatingsAndReviews",
  getAllratings_API :baseUrl +"/course/getAllratings"
}