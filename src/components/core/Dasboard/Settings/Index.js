import ChangePassword from "./ChangePassword"
import ChangeProfilepic from "./ChangeProfilePic"
import UpdateProfile from "./UpdateProfile"
import Delete from "./Delete"
 

const ProfileUpdate =()=>{
    return(
        <div className="w-11/12 max-w-maxContent mx-auto">
             <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>
              <ChangeProfilepic/>
              <UpdateProfile/>
              <ChangePassword/>
              <Delete/>
        </div>
    )
}

export default ProfileUpdate;