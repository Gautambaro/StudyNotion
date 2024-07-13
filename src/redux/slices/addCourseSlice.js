import { createSlice } from "@reduxjs/toolkit";

const initialState={
    step:1,
    course:null,
    editCourse:false,
    paymentLoading:false,
}

const AddCourseSlice = createSlice({
    name:"course",
    initialState:initialState,
    reducers:{
        setStep(state,action){
            state.step = action.payload
        },
        setCourse(state,action){
            state.course = action.payload
        },
        setEditCourse(state,action){
            state.editCourse = action.payload
        },
        setPaymentLoading(state,action)
        {
            state.paymentLoading =action.payload
        },
       resetCourse(state){
        state.step = 1;
        state.course = null;
        state.editCourse = false;
       },
    },
});

export const{setStep,setCourse,setEditCourse,setPaymentLoading,resetCourse} =AddCourseSlice.actions;
export default AddCourseSlice.reducer;