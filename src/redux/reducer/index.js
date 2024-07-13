import { combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "../slices/authSlice";
import cartSlice from "../slices/cartSlice";
import profileSlice from "../slices/profileSlice";
import addCourseSlice from "../slices/addCourseSlice";
import courseViewSlice  from "../slices/courseView";


const rootReducer = combineReducers({
  auth:AuthSlice,
  cart:cartSlice,
  profile:profileSlice,
  course:addCourseSlice,
  courseView:courseViewSlice,
 
})

export default rootReducer;