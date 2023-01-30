import { useState, useEffect } from "react";
import searchUserData from "../utils/searchUserData";
import switchFriendshipStatus from "../utils/switchFriendshipStatus";
import deleteData from "../utils/deleteData";
import AcceptFriend from "./AcceptFriend";
import addRelation from "../utils/addRelation";

export default function FriendshipStatus(props) {
    const { userId } = props;

    const [friendshipStatus, setFriendshipStatus] = useState("");
    const [deleteUser, setDeleteUser] = useState(false);

    const acceptFriend = () => {
        setFriendshipStatus("friends");
        console.log("setFriendshipStatus", friendshipStatus);

        addRelation(userId, "friends");
        setDeleteUser(true);
    };
    function handleFriendshipRequest() {
        if (deleteUser === true) {
            console.log("user about to be deleted", deleteUser);
            // deleteUser is true when the status is (friendRequest received or when friend request  send and then the user delete the button => deleteuser from friendships table)

            deleteData(userId, "friendships")
                .then(() => {
                    setFriendshipStatus("add friend");
                    setDeleteUser(false);
                })
                .catch((error) => {
                    return {
                        success: false,
                        message: error,
                    };
                });
        } else {
            const relationStatus = switchFriendshipStatus(friendshipStatus);
            addRelation(userId, relationStatus)
                
                .then((result) => console.log(result));

            const status = switchFriendshipStatus(friendshipStatus);
            console.log("currentState", friendshipStatus);

            setFriendshipStatus(status);
        }
    }
    useEffect(() => {
        console.log("useEffect fired FriendshipStatus ");

        searchUserData({
            userId,
            method: "search",
            targetDataTable: "friendships",
        }) // (id,method,targetTable)
            .then((result) => {
                const user = result.data;

                if (!user) {
                    setFriendshipStatus("add friend");
                } else if (user.accepted === true) {
                    setFriendshipStatus("friends");
                    setDeleteUser(true);
                } else {
                    if (user.recipient_id == userId) {
                        setFriendshipStatus("friend request sent/ cancel");
                        setDeleteUser(true);
                    } else if (user.sender_id == userId) {
                        setFriendshipStatus("friend request received /decline");
                        console.log("XXXXXXXXXXXXXXXXXXXXXXXXX",friendshipStatus);
                        setDeleteUser(true);
                    }
                }
            })
            .catch((error) => {
                return {
                    success: false,
                    message: error,
                };
            });
    }, []);
    return (
        <>
            <button
                style={{ color: "white" }}
                className="btn"
                onClick={handleFriendshipRequest}
            >
                {friendshipStatus == "friends" ? "unfriend" : friendshipStatus}
            </button>
            <div>
                {" "}
                {friendshipStatus == "friend request received /decline" && (
                    <AcceptFriend toggleAcceptFriendRequest={acceptFriend} />
                )}
            </div>
        </>
    );
}
