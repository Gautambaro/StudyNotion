import React from 'react'
import {  useForm} from "react-hook-form"
import { FaRupeeSign } from "react-icons/fa";
import { getCategory } from '../../../../../services/operations/course';
import { useEffect,useState} from 'react';
import Tagcomp from "./ChipIntup"
import Upload from "../Upload"
import InstructionTag from "./instruction"
import IconBtn from '../../../../common/IconBtn';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setStep } from '../../../../../redux/slices/addCourseSlice';
import {createCourse} from "../../../../../services/operations/course"
import { setCourse } from '../../../../../redux/slices/addCourseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants'
import { toast } from 'react-hot-toast';
import {EditCourse} from "../../../../../services/operations/course"



const RenderForm = () => {
 
  
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();
 
    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth);
    const {course} = useSelector((state)=>state.course);
    console.log("course",course)
    const {editCourse} = useSelector((state)=>state.course)
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(()=> {
        const getCategories = async() => {
            setLoading(true);
            const categories = await getCategory();
            if(categories.length > 0) {
                setCourseCategories(categories);
            }
            setLoading(false);
           
        }

        if(editCourse){
            setValue("courseName",course.Name);
            setValue("courseShortDesc",course.description);
            setValue("coursePrice",course.price);
            setValue("tag",course.tags);
            setValue("courseCategory",course.category);
            setValue("courseRequirements",course.instructions);
            setValue("courseBenefits",course.whatWillYouLearn);
            setValue("thumbnail",course.thumbnail);
        }

        getCategories();
    },[])
    console.log("getvalues",getValues())
    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseName !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTitle !== course.courseName ||
            currentValues.tag.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.thumbnail !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() 
            ){
                return true;
            }
            return false;
    }


     
    //handles next button click 
    const onSubmit = async(data)=>{
       
       if(editCourse){
        if(isFormUpdated()){
        const currentCourse = getValues();
        console.log("course",currentCourse.courseRequirements)
        const formData = new FormData();
        formData.append("courseId",course._id);
        if(currentCourse.courseName !== course.courseName){
           formData.append("courseName",data.courseName);
        }
        if(currentCourse.courseShortDesc !== course.description){
            formData.append("description",data.courseShortDesc);
         }
         if(currentCourse.coursePrice !== course.price){
            formData.append("price",data.coursePrice);
         }
         if(currentCourse.courseCategory._id !== course.category._id){
            formData.append("category",data.courseCategory);
         }
         if(currentCourse.courseBenefits !== course.whatYouWillLearn){
            formData.append("whatYouWillLearn",data.courseBenefits);
         }
         if(currentCourse.courseRequirements.toString() !== course.instructions.toString()){
            
            formData.append("instructions",JSON.stringify(data.courseRequirements));
         }
         if(currentCourse.tag.toString() !== course.tags.toString()){
            formData.append("tag",JSON.stringify(data.tag))
         }
         if(currentCourse.thumbnail !== course.thumbnail){
            formData.append("thumbnail",data.thumbnail)
        }
         setLoading(true)
         const results = await EditCourse(formData,token)
         if(results){
            setLoading(false)
            dispatch(setStep(2))
            dispatch(setCourse(results));
         } 
        }else{
            toast.error("no changes made so far")
        }
        return;
       }
       //create course
       const formData = new FormData();
       formData.append("courseName",data.courseName);
       formData.append("courseDescription",data.courseShortDesc);
       formData.append("price",data.coursePrice);
       formData.append("category",data.courseCategory);
       formData.append("whatWillYouLearn",data.courseBenefits);
       formData.append("tag",JSON.stringify(data.tag));
       formData.append("instructions",JSON.stringify(data.courseRequirements));
       formData.append("thumbnailImage",data.thumbnail);
       formData.append("status",COURSE_STATUS.DRAFT)

       const results = await createCourse(formData,token);
       console.log(results)
       if(results){
        console.log("results",results)
        toast.success("course created successfully")
        dispatch(setStep(2));
        dispatch(setCourse(results))
       }
    }
    return (
     <div className=' text-white flex flex-col gap-4'>
     
         <form onSubmit={handleSubmit(onSubmit)}>
         <div className='flex flex-col gap-3'>
            <div className='flex flex-col'>
           <label htmlFor='title'>Course Title<sup>*</sup></label>
           <input
            type='text'
            id='title'
            name='title'
            placeholder='Enter course title'
            className='text-black h-10 rounded-md pl-3'
            {...register("courseName",{required:true})}
           />
           {
            errors.title && (
                <span>
                    enter course title
                </span>
            )
           }
           </div>
            <div className='flex flex-col'>
           <label htmlFor='description'>Course short description<sup>*</sup></label>
           <textarea
            name='description'
            id='description'
            placeholder='Enter desciption'
            className='text-black h-20 rounded-md pl-3'
            {...register("courseShortDesc",{required:true})}
           />
           {
            errors.description && (
                <span>
                 enter course desciption
                </span>
             )
           }
           </div>
           <div className='flex flex-col'>
           <label htmlFor='price'>Price<sup>*</sup></label>
           <div className='relative'>
           
           <input
            name='price'
            type='number'
            id='price'
            placeholder='Enter price'
            className='text-black w-full pl-5 h-14'
            {...register("coursePrice",{required:true})}
           />
           <div className='absolute left-0 top-5 text-caribbeangreen-50 text-xl'>
            <FaRupeeSign />
           </div>
           </div>
           {
            errors.price && (
                <span>
                    enter price
                </span>
            )
           }
           </div>
           <div className='flex flex-col'>
           <label htmlFor='category'>Category<sup>*</sup></label>
           <select
           typeof='text'
           name='category'
           id='category'
           className='text-black h-10 pl-3 rounded-md'
           {...register("courseCategory",{required:true})}
           >
           <option value="" disabled>
            Select Category
           </option>
              {
                courseCategories.map((element,index)=>{
                    return(
                        <option key={index} value={element?._id}>
                            {element?.name}
                        </option>
                    )
                    
                 })
              }
           </select>
           </div>
               <div>
                   <label htmlFor='tag'>Enter tag<sup>*</sup></label>
                   <Tagcomp register={register} errors={errors} name={"tag"} id={"tag"} getValues={getValues} setValue={setValue}/>
               </div>
           </div>
                <div>
                    <Upload register={register} errors={errors} setValue={setValue} getValues={getValues}
                        name={"thumbnail"} id={"thumbnail"} label={"Select Image"}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='benifit'>Benifits of the Course<sup>*</sup></label>
                    <textarea
                        type='text'
                        name='benifit'
                        id='benifit'
                        className='text-black'
                        {...register("courseBenefits",{required:true})}
                    />
                    {
                    errors.benifits && (
                        <span>
                            plaese enter few benifits of the course
                        </span>
                    )
                }
                </div>
                <div>
                    <label htmlFor='benifitInstructor'>Requirements/Instructions<sup>*</sup></label>
                    <InstructionTag register={register} getValues={getValues} setValue={setValue} errors={errors}
                        id={"instructions"} name={"courseRequirements"}
                    />
                </div>
                <div className='flex justify-end gap-5'>
                  {
                    editCourse &&(
                        <button onClick={()=>dispatch(setStep(2))} className='text-white'>
                            Continue without Saving
                        </button>
                    )
                  }
                   <IconBtn type={"submit"}
                   disabled={loading}>
                   {editCourse? "Save changes":"Next"}
                   </IconBtn>
                   
                </div>
           </form>
     </div>
  )
}
export default RenderForm;