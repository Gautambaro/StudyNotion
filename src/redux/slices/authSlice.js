import { createSlice } from "@reduxjs/toolkit";



const intialState = ({
    token: localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")):null,
    signupData  :null,
    loading:false,
   
})



const AuthSlice = createSlice({
    name:"auth",
    initialState : intialState,
    reducers:{
        setSignupData(state,value){
           state.signupData = value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setToken(state,value){
          state.token = value.payload

        },
    },
});

export const{setSignupData,setLoading,setToken} = AuthSlice.actions;
export default AuthSlice.reducer;