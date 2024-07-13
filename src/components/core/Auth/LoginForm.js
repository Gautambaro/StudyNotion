import { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { Link ,useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/Auth";
import { useDispatch } from "react-redux";

const LoginFrom =()=>{

  const dispatch = useDispatch();
  const navigate = useNavigate();

    const [formData , setFromData] =useState({email:"",password:""});
    const [showPassword, setShowPassword] = useState(false);
    function onChangeHander(event){
       setFromData((prev)=>(
        {
            ...prev,
            [event.target.name]:event.target.value
        }
       ))
    }
    const{email,password} = formData;

    function submitHandler(event){
        event.preventDefault();
        dispatch(login(email,password,navigate));
    }
    return(
        <div>
           
             
             <form onSubmit={submitHandler}>
                 <label>
                    <p>Email Address</p>
                    <input 
                    required
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={formData.email}
                    onChange={onChangeHander}
                    className="text-black"
                    >
                        
                    </input>
                 </label>
                 
                 <label>
                    <p>Password</p>
                    <input 
                    required
                    placeholder="Enter your Password"
                    type={showPassword?("Password"):("text")}
                    name="password"
                    value={formData.password}
                    onChange={onChangeHander}
                    className="text-black"
                    >
                        
                    </input>
                    <span onClick={()=>(
                        setShowPassword((prev)=>!prev)
                    )}>
                    {showPassword?(<AiOutlineEye/>):(<AiOutlineEyeInvisible/>)}
                    </span>
                 </label>
                 <Link to={"/ResetPassword"}>
                <p className="text-pink-300">reset Password</p>
             </Link>
             <button type="submit" className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
                 Sign in
             </button>
             </form>
             
        </div>
    )
}
export default LoginFrom;