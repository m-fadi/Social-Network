import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FriendshipStatus from "./FriendshipStatus";
import ChatContainer from "./chat/PrivateChat";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function FriendProfile() {
    const [error, setError] = useState("");
    const [user, setUser] = useState({});
    
    const userId = useParams().id;

    useEffect(() => {
        fetch("/userData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                findUserProfile: true,
                targetDataTable: "users",
            }), // findUserProfilre is used in the severer to serve this fetch
        })
            .then((result) => result.json())
            .then((result) => {
                if (!result.success) {
                    setError(result.message);
                    return;
                }
                // console.log("search Result friendProfile", result.data);
                setUser(() => {
                    return { ...result.data };
                });
            });
    }, []);

    return (
        <div className="friendProfile">
            <div className="profile-img">
                <img src={user.image_urls || "../images/profileDefault.jpeg"} />
                <h5 style={{ color: "white" }}>
                    {" "}
                    {user.firstname} {user.lastname} <br></br> {user.email}
                </h5>
            </div>

            <FriendshipStatus userId={userId} />
            <div className="bio">
                <h6>
                    The Biography of : {user.firstname} {user.lastname}
                </h6>
                <p className="bio-text">{user.bio}</p>
            </div>
        </div>
    );
}
