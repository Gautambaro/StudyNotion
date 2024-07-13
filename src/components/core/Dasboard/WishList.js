import { useDispatch, useSelector } from "react-redux";
import Cart from "./Cart/index";
import IconBtn from "../../common/IconBtn";
import { useEffect, useState } from "react";
import {buyCourse} from "../../../services/operations/Payment"
import { useNavigate } from "react-router-dom";

const WishList = ()=>{
    const {cart,total,totalItem} =useSelector((state)=>state.cart)
    const {token} =useSelector((state)=>state.auth)
    const{user} =useSelector((state)=>state.profile)
    const [courseId,setCourseId] = useState([])
    const dispatch= useDispatch();
    const navigate = useNavigate()

  useEffect(()=>{
    const ids = cart.map(item=>item._id)
    setCourseId(ids)
  },[cart])
  console.log("courseId",courseId)

    function onclickhandler(){
        if(token){
            const response = buyCourse(token,[courseId],user,navigate,dispatch)
            console.log("response",response)
        }

   }
    return(
        <div className="text-white bg-richblack-300">
        <div className="flex gap-2">
            <p>Home</p>
            <p>Dashboard</p>
            <p>WishList</p>
        </div>
             <h1 className="text-white mt-4 text-4xl">My WishList</h1>
           <div>
                <p className="mt-4"><span>{totalItem}</span>Courses in WishList</p>
                <div className="flex gap-4">
                     <div>
                        {
                            cart.map((cart,index)=>{
                                return(
                                    <Cart data={cart} key={index} courseId={courseId} setCourseId={setCourseId} />
                                   
                                )
                            })
                        }
                     </div>
                     
                     <div className="bg-richblack-700 rounded-md">
                        <p>Total Price</p>
                        <p className="text-yellow-300 text-3xl">RS<span>{total}</span></p>
                        <IconBtn text="Buy Now" onclick={onclickhandler}/>
                     </div>
                </div>
           </div>
        </div>
    )
}
export default WishList;