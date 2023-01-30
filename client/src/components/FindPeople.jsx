import { useState, useEffect } from "react";

import FriendshipStatus from "./FriendshipStatus";
import { Link } from "react-router-dom";
export default function FindPeople() {
    const [name, setName] = useState("date");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [myId, setMyId] = useState("");
    const handleChange = (e) => {
        e.target.value == "" ? setName("date") : setName(e.target.value);
    };

    useEffect(() => {
        console.log("useEffect findPeople");
        fetch("/findPeople/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        })
            .then((result) => result.json())
            .then((result) => {
                if (!result.success) {
                    setError(result.message);
                    return;
                }
                console.log("search Result", result);
                setUsers(() => [...result.data]);
                setMyId(result.myId);

                console.log("users from setUsers find people", users);
            });
    }, [name]);

    const listOfUsers = users.map((user) => {
        const myProfile = user.id === myId ? true : false; // check if current profile is my profile
       
        const link = myProfile ? `#` : `/friendProfile/${user.id}`; // routing link : empty# if this is my profile
        console.log(user.id);
        return (
            <div  key={user.id}>
                {!myProfile && (
                    <div  className="user">
                        {
                            <Link to={link}>
                                <img
                                    src={`${
                                        user.image_urls ||
                                        "../images/profileDefault.jpeg"
                                    }`}
                                    alt=""
                                    className="user"
                                />
                            </Link>
                        }

                        <p>
                            {user.firstname} {user.lastname}
                        </p>
                        {/* <AddFriend userId={user.id}/> */}
                        <FriendshipStatus userId={user.id} />
                        <Link key={user.id} to={`/privateChat/${user.id}`}> chat</Link>
                    </div>
                )}
            </div>
        );
    });
    console.log("listOfUsers", listOfUsers);
    return (
        <div className="find-users">
            <input
                type="text"
                placeholder="name"
                onChange={handleChange}
                name="name"
                className="find-people-input"
            />

            <div className="list-of-users">
                {error && (
                    <h5>
                        {" "}
                        {error} {` with the name:${name}`}
                    </h5>
                )}

                <div className="users">{listOfUsers}</div>
            </div>
        </div>
    );
}
