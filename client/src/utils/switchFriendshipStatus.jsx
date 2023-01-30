

export default function switchFriendshipStatus(status) {
    let friendshipStatus;
    switch (status) {
        case "add friend":
            friendshipStatus = "friend request sent/ Cancel";

            break;
        case "friend request sent/ cancel":
            friendshipStatus = "add friend";

            break;
        case "friends":
            friendshipStatus = "add friend";

            break;
        case "friend request received / accept":
            friendshipStatus = "friends";
            // missing reject friendship request!!!
            break;
        case "friend request received /decline": // missing when to setFriendshipStatus("accepted")
            friendshipStatus = "add friend";
    }

    // const [buttonText, setButtonText] = useState(friendshipStatus);
    // const [friendshipStatus, setFriendshipStatus] = useState(status);
    // switch (friendshipStatus) {
    //     case "notFriends":
    //         setFriendshipStatus("friendRequestSent, Cancel");
    //         setButtonText("friend equest sent: Cancel");
    //         break;
    //     case "friendRequestSent":
    //         setFriendshipStatus("notFriends");
    //         setButtonText("add friend");
    //         break;
    //     case "friends":
    //         setFriendshipStatus("notFriends");
    //         setButtonText("unfriend");
    //         break;
    //     case "gotFriendRequest":
    //         setFriendshipStatus("friends");
    //         setButtonText("accept"); // missing reject friendship request!!!
    //         break;
    //     case "friend Request recived": // missing when to setFriendshipStatus("accepted")
    //         setFriendshipStatus("friend Request recived/ Decline");
    //         setButtonText("friends");
    // }
    // console.log("friendshipStatus after switch ",friendshipStatus);
    return friendshipStatus;
}
