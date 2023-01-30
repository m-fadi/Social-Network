import React from "react";

const AcceptFriend = (props) => {
    
    return (
        <div>
            <button  className="accept-friend" onClick={() => props.toggleAcceptFriendRequest()}> accept </button>
        </div>
    );
};

export default AcceptFriend;
