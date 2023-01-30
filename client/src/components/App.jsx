import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logo from "./Logo";
import ProfilePic from "./ProfilePic";
import Logout from "./Logout";
import FindPeople from "./FindPeople";
import Profile from "./Profile";
import Login from "./login";
import FriendsAndRequests from "../features/friends/FriendsAndRquests";
import DeleteProfile from "./DeleteProfile";
import PrivateChat from "./chat/PrivateChat";
import Chat from "../features/chat/Chat";

import FriendProfile from "./FriendProfile";

export default function App() {
    const [uploaderOpen, setUploaderOpen] = useState("");
    const [message, setMessage] = useState(false);

    const [userData, setUserData] = useState({});

    const openUploader = () => {
        //console.log("profile picture change!!");
        setUploaderOpen(true);
    };
    const closeUploader = () => {
        // console.log("profile picture change!!");
        setUploaderOpen(false);
    };
    const changeProfilerPic = (profileImgName) => {
        setUserData({
            ...userData,
            image_urls: profileImgName || "../images/profileDefault.jpeg",
        });
    };

    const sendMessage = (message) => {
        setMessage(message);
    };

    useEffect(() => {
        fetch("/userData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: null, targetDataTable: "users" }),
        })
            .then((result) => result.json())
            .then((result) => {
                // console.log("result useEffect", result);

                setUserData(() => {
                    return {
                        ...result.data,
                        image_urls:
                            result.data.image_urls ||
                            "../images/profileDefault.jpeg",
                    };
                });
            });
    }, []);
    const tools = {
        toggleProfilePic: changeProfilerPic,
        toggleCloseUploader: closeUploader,
        toggleOpenUploader: openUploader,
        userData: userData,
        uploaderOpen: uploaderOpen,
        openUploader: openUploader,
    };
    //console.log("userData App", userData);
    return (
        <div className="app">
            <BrowserRouter>
                <header>
                    {/* {uploaderOpen && <UploadPic tools={tools} />} */}

                    <ProfilePic tools={tools} />
                    <Logout />
                    <DeleteProfile id={userData.id} />
                    <Link to="/profile"> Profile</Link>
                    <Link to="/friendsAndRequests"> Friends and requests</Link>
                    <Link to="/chat"> Broadcast</Link>
                    <Link to="/profile/findPeople"> Find Friends</Link>

                    <Logo />
                </header>
                <Routes>
                    <Route
                        path="/privateChat/:otherId"
                        element={
                            <PrivateChat
                                // otherUser={user}
                                avatar={userData.image_urls}
                                userData={userData}
                            />
                        }
                    ></Route>
                    <Route
                        path="/chat"
                        element={
                            <Chat
                                avatar={userData.image_urls}
                                userData={userData}
                            />
                        }
                    ></Route>
                    <Route
                        path="/profile"
                        element={<Profile tools={tools} />}
                    ></Route>
                    <Route
                        path="/friendsAndRequests"
                        element={<FriendsAndRequests />}
                    ></Route>
                    <Route
                        path="/friendProfile/:id"
                        element={<FriendProfile />}
                    ></Route>

                    <Route
                        path="/profile/findPeople"
                        element={<FindPeople />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
