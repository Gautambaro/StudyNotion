import React from 'react'
import {useForm} from "react-hook-form"
import { useSelector,useDispatch } from 'react-redux';
import IconBtn from '../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import {updateProfile} from "../../../../services/operations/settings"

 const UpdateProfile = () => {
    const genders =["male","female","others","prefer not to say"];
     const dispatch=useDispatch();
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const {user} =useSelector((state)=>state.profile)
    const {token} = useSelector((state)=>state.auth)
    
    async function formSubmit(data){
      try{
         dispatch(updateProfile(token,data,navigate)) 
      }catch(error){
        console.log(error)
      }
    }
  return (
    <div className='my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
    <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
    <form onSubmit={handleSubmit( formSubmit)}>
    <div className='flex flex-col gap-5 lg:flex-row'>
    <div className='flex flex-col gap-2 lg:w-[48%]'>
    <label htmlFor='firstName' className="text-white">First Name</label>
      <input
        type='text'
        name='firstName'
        id='firstName'
        className='text-black rounded-md'
        {...register("firstName",{required:true})}
        defaultValue={user?.firstName}
      />
      {
        errors.firstName && (
            <span>
                <p>enter first name</p>
            </span>
        )
      }
      </div>
      <div className="flex flex-col gap-2 lg:w-[48%]">
      <label htmlFor='lastName' className='text-white'>Last Name</label>
      <input
        type='text'
        name='lastName'
        id='lastName'
        placeholder='enter last name'
        className='text-black rounded-md'
        {...register("lastName",{required:true})}
        defaultValue={user?.lastName}
      />
      {
        errors.lastName &&(
            <span>
                <p>enter last name</p>
            </span>
        )
      }
      </div>
      </div>
           <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">

        <label htmlFor='DOB' className='text-white'>Date of birth</label>
        <input
            type='date'
            name='DOB'
            id='DOB'
            className='text-black rounded-md'
           {...register("DateOfBirth",{required:true})}
           defaultValue={user?.additionalDetails?.DateOfBirth}
        />
        {
        errors.DOB &&
        <span>
            <p>Enter date of birth</p>
        </span>
        }
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
        <label htmlFor='gender' className='text-white'>Gender</label>
         <select
            type='text'
            name='gender'
            id='gender'
            className='text-black rounded-md'
            {...register("gender",{required:true})}
            defaultValue={user?.additionalDetails?.gender}
         select>
        
        {
            genders.map((gender,index)=>{
                return(
                    <option key={index} value={gender}>
                       {gender}
                    </option>
                )
            })
        }
        </select>
        {
            errors.gender && (
                <span>
                    <p>enter gender</p>
                </span>
            )
         }
         </div>
         </div>
         <div className="flex flex-col gap-5 lg:flex-row">
         <div className="flex flex-col gap-2 lg:w-[48%]">
        <label htmlFor='phone' className='text-white'>Phone Number</label>
        <input
          type='tel'
          name='phone'
          id='phone'
          className='text-black rounded-md'
          {...register("contact",{required:{value:true,message:"please enter your contact number"},
          maxLength: {value:12,message:'invalid phone number'},
          minLength: {value:10 , message:'invalid phone number'}
          })}
          defaultValue={user?.additionalDetails?.contact}
        />
        {
          errors.contact && (
            <span>
              <p>enter contact</p>
            </span>
          )
        }
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">

        <label htmlFor='about' className='text-white'>About</label>
        <input
          type='text'
          name='about'
          id='about'
          className='text-black rounded-md'
          {...register("about",{requited:true})}
          defaultValue={user?.additionDetalis?.About}
        />
        {
          errors.about && (
            <span>
              <p>enter about</p>
            </span>
          )
        }
        </div>
        </div>
        
        <div>
          <button onClick={()=>navigate("/dashboard/my-profile")}
          className='cursorn-pointer text-center'
          >Cancel</button>
          <IconBtn type="submit" text="save" />
        </div>
        </form>
    </div>
  )
}
export default UpdateProfile;