//import { useState, useEffect } from "react";
import Bio from "./Bio";
import UploadPic from "./UploadPic";

export default function Profile(props) {
    const{userData,uploaderOpen}=props.tools;
    return (
        <div className="profile">
            <Bio userData={userData} />
            {uploaderOpen && (
                <UploadPic
                    tools={props.tools}
                />
            )}
        </div>
    );
}

