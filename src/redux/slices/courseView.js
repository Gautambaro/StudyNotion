import { createSlice } from "@reduxjs/toolkit";

const initialState ={
  totalNumberOfLecture : 0,
  courseEntierData: [],
  courseSectionData:[],
  completedLecture:[],
}

const courseViewSlice = createSlice({
    name:"courseView",
    initialState:initialState,
    reducers:{
      setTotalNumberOfLecture(state,action){
        state.totalNumberOfLecture = action.payload
      },
      setCourseEntierData(state,action){
        state.courseEntierData = action.payload
      },
      setCourseSectionData(state,action){
        state.courseSectionData = action.payload
      },
      setCompletedLecture(state,action){
        state.completedLecture = action.payload
      }
   }
})
export const{setTotalNumberOfLecture,setCourseEntierData,setCourseSectionData,setCompletedLecture} = courseViewSlice.actions;
export default courseViewSlice.reducer;