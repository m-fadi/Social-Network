//import { useState } from "react";
export default function ProfilePic(props) {
    // const [profileImg, setProfileImg] = useState(
    //     "../images/profileDefault.jpeg"
    //);
    const { toggleOpenUploader,userData } = props.tools;
    console.log("Props in Profile Picprops",props.tools);
    return (
        <div className="profile-img">
            <img
                src={userData.image_urls}
                onClick={() => toggleOpenUploader()}
            />
            {userData.firstname} {userData.lastname}
        </div>
    );
}
