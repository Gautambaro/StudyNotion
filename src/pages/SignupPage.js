
import signupImg from "../assets/Images/signup.webp"
import Tamplate from "../components/core/Auth/Tamplate";

const SignUp =()=>{
   
    return(
        <div>
            <Tamplate
                 title="Join the millions learning to code with StudyNotion for free"
                    description1="Build skills for today, tomorrow, and beyond."
                    description2="Education to future-proof your career."
                    image={signupImg}
                    formType="signup"

            /> 
        </div>
    )
}
export default SignUp;