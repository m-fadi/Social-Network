import { useState, useEffect } from "react";
import searchUserData from "../utils/searchUserData";

import addRelation from "../utils/addRelation";

function AddFriend(props) {
    const [relationFriend, setRelationFriend] = useState(false);
    //console.log(props.userId);
    const { userId } = props;

    const handleAddFriend = (userId) => {
        addRelation(userId, "add friend").then((result) => {
            console.log(result);
            setRelationFriend(true);

            //dispatch(receivedRequests())
        });
    };
    const btnText = relationFriend ? "unfriend" : "add friend";
    useEffect(() => {
        searchUserData({
            userId: null,
            targetDataTable: "join",
            method: "search",
        }).then((result) => {
            console.log("result useEffect in FriendsAndRequests", result);
            //dispatch(receivedRequests(result.data));
        });
    }, []);
    return (
        <>
            <button onClick={() => handleAddFriend(userId)} className="btn">
                {" "}
                {btnText}
            </button>
        </>
    );
}

export default AddFriend;
