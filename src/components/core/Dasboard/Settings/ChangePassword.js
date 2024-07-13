import { useState} from "react";
import {useForm} from "react-hook-form";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {changePasswordApi} from "../../../../services/operations/settings"
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn";

const ChangePassword =()=>{
    const [showPassword,setShowPassword]= useState(false);
    const [show,setShow] = useState(false);
    
    const {token } = useSelector((state)=>state.auth);
    
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState:{errors}
    }=useForm();

  function submitHandler (data){
   
    changePasswordApi(token,data,navigate)
  
}
    return(
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="text-lg font-semibold text-richblack-5"> Change Password</div>
             <form onSubmit={handleSubmit(submitHandler)}>
                 <div className="flex flex-col gap-5 lg:flex-row">
                 <div className="relative flex flex-col gap-2 lg:w-[48%]">
                 <div>
                 <label htmlFor="password" className="text-lg font-semibold text-richblack-5">Current Password</label>
                 </div>
                 <input
                    name='password'
                    id='password'
                    className="rounded-md"
                    type ={showPassword?'text':'password'}
                    {...register('oldpassword',{required:true})}
                 />
                {
                    errors.password &&
                    <span>
                       <p>password is incorrect</p>
                    </span>
                }
                <div onClick={()=>setShowPassword((prev)=>!prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer bg-black rounded-full">
                {
                
                    showPassword ? (<div className="text-white"><FaRegEye /></div>):<div className="text-white"><FaEyeSlash /></div>
                }
                </div>
                </div>
                <div className="relative flex flex-col gap-2 lg:w-[48%]">
                
                <label htmlFor="NewPassword" className="text-lg font-semibold text-richblack-5">Change Password</label>
                
                <div>
                <input
                    name="NewPassword"
                    id="NewPassword"
                    type={show?'text':'password'}
                    className="w-full rounded-md"
                    {...register('newPassword',{required:true})}
                />
                {
                    errors.NewPassword &&
                    <span>
                        <p>wrong password</p>
                    </span>
                }
                 <div onClick={()=>setShow((prev)=>!prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer bg-black rounded-full">
                    {
                        show?(<div className="text-white"><FaRegEye /></div>):(<div className="text-white"><FaEyeSlash /></div>)
                    }
                 </div>
                </div>
                 </div>
                 </div>
                 <div className="mt-5">
                 <IconBtn type="submit" text="update" 
                 >
                    
                 </IconBtn>
                 </div>
             </form>
        </div>
    )
}
export default ChangePassword;