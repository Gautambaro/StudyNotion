
const Tab= ({tabData,field,setField})=>{
    
    return(
        <div 
         style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}

        className="flex gap-2 bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
            {
                tabData.map((tab)=>{
                    return(
                        <div className={`${field===tab.type?"bg-richblack-900 text-richblack-5":
                        "bg-transparent text-richblack-200"} cursor-pointer py-2 px-5 rounded-full transition-all duration-200`}
                        onClick={()=>setField(tab.type)} key={tabData.id}>{tab.tabName}</div>
                    )
                })
            }
        </div>
    )

    
}
export default Tab;