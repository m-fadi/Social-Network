import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import addRelation from "../../utils/addRelation";
import {
    receivedRequests,
    acceptRequest,
    declineRequest,
} from "./friendsSlice";
import { Link } from "react-router-dom";
import searchUserData from "../../utils/searchUserData";
import deleteData from "../../utils/deleteData";


export default function FriendsAndRquests() {
    
    const dispatch = useDispatch();
    const friendsList = useSelector((state) => {
        console.log("the state in friendsList", state);
        //if (state.friends.length) {
        return (
            state.friends && state.friends.filter((friend) => friend.accepted)
        );
        // }
    });

    const friendRequestsList = useSelector((state) => {
        return (
            state.friends && state.friends.filter((friend) => !friend.accepted)
        );
    });
    console.log("friendsList ", friendsList);
    console.log(" requestsList", friendRequestsList);

    const handleAccept = (userId) => {
        addRelation(userId, "friends").then(() => {
            dispatch(acceptRequest(userId));
        });
    };
    const handleDecline = (userId) => {
        deleteData(userId, "friendships").then(() => {
            dispatch(declineRequest(userId));
        });
    };

    useEffect(() => {
        searchUserData({
            userId: null,
            targetDataTable: "join",
            method: "search",
        }).then((result) => {
            console.log("result useEffect in FriendsAndRequests", result);
            dispatch(receivedRequests(result.data));
        });
    }, []);

    const friendsListText = friendsList.length ? (
        <p style={{ color: "green" }}>
            {" "}
            you have {friendsList.length} Friends 😄
        </p>
    ) : (
        <p style={{ color: "red" }}>
            {" "}
            Sorry for You you have NO Friends, you are lonely go meet real ones
            😥
        </p>
    );

    const friendsRequestsText = friendRequestsList.length ? (
        <p style={{ color: "green" }}>
            {" "}
            you have {friendRequestsList.length} Requests 😄, remember they are
            not real ones 🧐
        </p>
    ) : (
        <p style={{ color: "red" }}> Sorry for You you have NO Requests 😥, send some, they are on sold.</p>
    );

    return (
        <div className="friendsAndRequests">
            {" "}
            <div className="frindsList" style={{ color: "white" }}>
                {" "}
                {friendsListText}
                {friendsList.map((friend) => {
                    console.log("friend friendList ", friend );
                    return (
                        <div key={friend.id} className="user friend">
                            <Link to={`/friendProfile/${friend.id}`}>
                                <img
                                    src={`${
                                        friend.image_urls ||
                                        "../images/profileDefault.jpeg"
                                    }`}
                                    alt=""
                                />

                                <p>
                                    {friend.firstname} {friend.lastname}
                                </p>
                            </Link>
                            <button
                                className="btn"
                                style={{ color: "red" }}
                                onClick={() => handleDecline(friend.id)}
                            >
                                {" "}
                                unfriend
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="requestsList" style={{ color: "white" }}>
                {friendsRequestsText}
                {friendRequestsList.map((friend) => {
                    return (
                        <div key={friend.id} className="user friend">
                            <Link to={`/friendProfile/${friend.id}`}>
                                <img
                                    src={`${
                                        friend.image_urls ||
                                        "../images/profileDefault.jpeg"
                                    }`}
                                    alt=""
                                />
                                <p>
                                    {friend.firstname} {friend.lastname}
                                </p>
                            </Link>
                            <div>
                                { friend.sender_id=== friend.id && <button
                                    className="btn"
                                    style={{ color: "green" }}
                                    onClick={() => handleAccept(friend.id)}
                                >
                                    {" "}
                                    Accept
                                </button>}
                                <button
                                    className="btn"
                                    style={{ color: "red" }}
                                    onClick={() => handleDecline(friend.id)}
                                >
                                    cancel
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
