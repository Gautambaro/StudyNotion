import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    cart:localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")):[],
    total:localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")):0,
    totalItem:localStorage.getItem("totalItem") ? JSON.parse(localStorage.getItem("totalItem")):0,
  
};

const cartSclice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        addToCart(state,action){
           const course = action.payload
           const index = state.cart.findIndex((item) => item._id === course._id)

           if(index >= 0){
            toast.error("course already in the cart");
            return
           }
           state.cart.push(course)
           state.totalItem++
           state.total += course.price
           localStorage.setItem("cart",JSON.stringify(state.cart))
           localStorage.setItem("total",JSON.stringify(state.total))
           localStorage.setItem("totalItem",JSON.stringify(state.totalItem))

           toast.success("course added to cart")
        },
        removeCart(state,action){
            const courseId = action.payload
            const index = state.cart.findIndex((item)=> item._id === courseId)
            if(index >= 0){
                state.totalItem --
                state.total -= state.cart[index].price
                state.cart.splice(index,1)
                toast.success("Course removed from cart")
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("total",JSON.stringify(state.total))
                localStorage.setItem("totalItem",JSON.stringify(state.totalItem))
                
               
            }
        },
        
            resetCart(state){
                
                state.cart.splice(0,state.cart.length)
                state.total = 0
                state.totalItem = 0
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("total",JSON.stringify(state.total))
                localStorage.setItem("totalItem",JSON.stringify(state.totalItem))
            },
        
    }
});
export const {addToCart, removeCart,resetCart} = cartSclice.actions;
export default cartSclice.reducer;