import Tamplate from "../components/core/Auth/Tamplate"
import loginImg from "../assets/Images/login.webp"

const Login =()=>{
    
    return(
        <div>
             <Tamplate
                title="Welcome Back"
                description1="Build skills for today, tomorrow, and beyond."
                description2="Education to future-proof your career."
                image={loginImg}
                formType="login"

             />
        </div>
    )
}
export default Login;