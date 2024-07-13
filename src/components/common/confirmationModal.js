import React from 'react'


 const ConfirmationModal = ({data}) => {
  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
       <div className='w-11/12 max-w-[350px] rounded-lg border-richblack-400 bg-richblack-800 p-6 flex flex-col items-center'>
        <h1 className='text-2xl font-semibold text-richblack-200'>{data?.text1}</h1>
        <p className='text-richblack-200 leading-6 mt-3 mb-5'>{data?.c}</p>
       
        <div className='flex items-center gap-x-4'>
            <button className='rounded-md bg-yellow-300 py-[8px] px-[20px] font-semibold text-richblack-900' onClick={data?.btn2Handler}>Cancel</button>
            <button className='rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900'
            onClick={data?.btn1Handler}>Yes</button>
        </div>
        </div>
    </div>
  )
}

export default ConfirmationModal;
