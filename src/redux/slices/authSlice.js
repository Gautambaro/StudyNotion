import { createSlice } from "@reduxjs/toolkit";

const TOKEN_EXPIRATION_DURATION = 24 * 60 * 60; // 24 hours in seconds

const intialState = ({
    // token: localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")):null,
     token: loadTokenFromLocalStorage(),
    signupData  :null,
    loading:false,
   
})

function loadTokenFromLocalStorage() {
    const tokenData = JSON.parse(localStorage.getItem("tokenData"));
    if (!tokenData) return null;

    // Check if the token has expired
    if (tokenData.expiresAt < Date.now()) {
        // Token expired, remove it from localStorage
        localStorage.removeItem("tokenData");
        return null;
    }

    return tokenData.token;
}

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
            const token = value.payload
            const expiresAt = Date.now() + TOKEN_EXPIRATION_DURATION * 1000; // convert seconds to milliseconds

            state.token = token;
            localStorage.setItem("tokenData", JSON.stringify({ token, expiresAt }));
        },
    },
});

export const{setSignupData,setLoading,setToken} = AuthSlice.actions;
export default AuthSlice.reducer;