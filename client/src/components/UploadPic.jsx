import { useState, useEffect } from "react";
import Delete from "./Delete";

export default function UploadPic(props) {
    const { toggleProfilePic, toggleCloseUploader, userData } = props.tools;
    const { firstname, lastname} = userData;
    const [error, setError] = useState("");

    const [isProfileImg, setIsProfileImg] = useState(false); //used to show or hide delete button


    function uploadImage(e) {
        e.preventDefault();
        

        const myFileInput = document.querySelector("input[type='file']");

        const image = myFileInput.files[0];
        if (image == undefined) {
            const message = "You must first select an image!";
            setError(message);
            return;
        }
        console.log("empty file", image);
        const formData = new FormData();
        formData.append("image", image);

        fetch("/profileImg", {
            method: "POST",

            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                if (!result.success) {
                    setError(result.message);
                }
                if (result.success) {
                    toggleProfilePic(result.data);
                    setIsProfileImg(true); // apic is added
                }
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        userData.image_urls !== "../images/profileDefault.jpeg"
            ? setIsProfileImg(true)
            : setIsProfileImg(false);
    }, []);

    return (
        <div className="img-uploader">
            <p className="closeUploader " onClick={toggleCloseUploader}>
                x
            </p>
            <h5 className="errorMessage">{error}</h5>
            <form onSubmit={uploadImage}>
                <input
                    className="inputFile  "
                    type="file"
                    name="photo"
                    id="photo"
                />
                {/* <label htmlFor="file">Select file</label> */}
                <input className="uploader-btn" type="submit" value="upload" />
            </form>
            <p className="name" style={{ color: "blue", display: "inline" }}>
                {firstname} {lastname}
            </p>
            {isProfileImg && <Delete tools={props.tools} />}
        </div>
    );
}
