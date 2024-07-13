import "./App.css"
import { Routes,Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Signup from "./pages/SignupPage"
import Login from "./pages/Login";
import Navbar from "./components/common/Navbar";
import VerifyEmail from "./pages/otpPage";
import OpenRoutes from "./components/core/Auth/OpenRoutes";
import ResetPassword from "./pages/resetPassword";
import UpdatePassword from "./pages/updatePassword";
import AboutUs from "./pages/AboutusPage";
import ContactUsPage from "./pages/ContactUsPage";
import Dashborad  from "./pages/Dashborad";
import Profile from "./components/core/Dasboard/MyProfile";
import  Cart from "./components/core/Dasboard/Cart/index";
import EnrolledCourse from "./components/core/Dasboard/EnrolledCourses"
import ProfileUpdate from "./components/core/Dasboard/Settings/Index"
import { useSelector } from "react-redux";
import Courses from "./components/core/Dasboard/MyCourse"
import AddCourse from "./components/core/Dasboard/AddCourse/index"
import EditCourse from "./components/core/Dasboard/EditCourse/Index";
import {  ACCOUNT_TYPE } from "./utils/constants";
import  Catalog from "./pages/CategoryPage";
import CourseDetails from "./pages/courseCardView";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import ViewCourse from "./pages/ViewCourse";
import VideoDetalis from "./pages/VideoDetalis";
import Instructor from "./components/core/Dasboard/instructorDasboardPage"

function App() {
  const {user} = useSelector((state)=>state.profile);
  return (
   <div className="bg-richblack-900">
   <Navbar/>
    <Routes>
      <Route path="/" element=<Home/>></Route>
      <Route path="/catalog/:catalogName" element=<Catalog/>></Route>
     <Route path="/courses/:courseId" element=<CourseDetails/>></Route>

      <Route path="/Login" element={
      <OpenRoutes>
      <Login/>
      </OpenRoutes>
      } >

      </Route>
      <Route path="/Signup" element={
        <OpenRoutes>
            <Signup/>
      </OpenRoutes>
      }>
      </Route>
      <Route path="/OtpPage" element= {
        <OpenRoutes>
      <VerifyEmail/>
      </OpenRoutes>
      }> </Route>
     
     <Route path="/ResetPassword" element = <OpenRoutes>
      <ResetPassword/>
     </OpenRoutes>
     ></Route>
     
     <Route path="/update-password/:id" element ={
      <OpenRoutes>
      <UpdatePassword/>
      </OpenRoutes>
     } > 
     </Route>

     <Route path="/About" element= {
      // <OpenRoutes>
     <AboutUs/>
    //  </OpenRoutes>
     }></Route>
     
     <Route path="/contact" element=<ContactUsPage/>></Route>
     
     <Route 
     element={
      <PrivateRoute>
     <Dashborad/>
     </PrivateRoute>
     }>
     <Route path="dashboard/my-Profile" element={<Profile/>}/>
     <Route path="dashboard/Settings" element={<ProfileUpdate/>}/>

     
      {/* { user.accountType ===  ACCOUNT_TYPE.STUDENTS && (
        <> 
     <Route path="dashboard/enrolled-courses" element={<EnrolledCourse/>}/>
     <Route path="dashboard/purchase-history" element ={<PurchaseHistory/>}/>
     <Route path="dashboard/WishList" element={<WishList/>}/>
       </>
       )} 
       {
        user.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
           <Route path="dashboard/add-course" element ={<AddCourse/>}/>
           <Route path ="dashboard/my-courses" element ={<Courses/>}/>
           <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
        </>
        )
       } */}

          {user && user.accountType === ACCOUNT_TYPE.STUDENTS && (
                    <> 
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourse/>}/>
              <Route path="dashboard/WishList" element={<Cart/>}/>
                 </>
          )}
          {user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                 <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element ={<AddCourse/>}/>
              <Route path ="dashboard/my-courses" element ={<Courses/>}/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
                 </>
          )}

        
     </Route>
      

       <Route
      element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>
      }>
         <>       
        <Route path="view-course/:courseId/section/:sectionId/subSection/:subSectionId" element={<VideoDetalis/>}/>
         </>

       
      </Route> 


      {/* <Route element={
        <PrivateRoute>
          <ViewCourse />
        </PrivateRoute>
      }>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENTS && (
          <>
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetalis/>}
          />
          </>
        )
      }

      </Route> */}



      <Route path="*" element={<ErrorPage/>}></Route>
    </Routes>
   </div>
  );
}

export default App;
