import { useState, useEffect } from "react";

//////////////////////UseEffect for loading the userData
export default function Bio(props) {
    //console.log("userData in BIO from APP", props.userData);
    const { userData } = props;
    const [bioText, setBioText] = useState("");
    const [bioExist, setBioExist] = useState(false);
    const [error, setError] = useState("");

    function changeInput(e) {
        // setBioText((prev) => {
        //     return {
        //         ...prev,
        //         [e.target.name]: e.target.value,
        //     };
        // });
        let text = e.target.value;
        setBioText(text);
    }
    function updateBio() {
        setBioExist(false);
    }
    function handleSubmit() {
        fetch("/update_bio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bioText }),
        })
            .then((result) => result.json())

            .then((result) => {
               // console.log("result bio text", result.data);
                setBioText(result.data.bio);
                setBioExist(true);
                console.log("bioText", bioText);
            })
            .catch(() => {
                setError({
                    error: "somthing went wrong ",
                });
            });
    }

    useEffect(() => {
        fetch("/userData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: null, targetDataTable: "users" }),
        })
            .then((result) => result.json())
            .then((result) => {
                //  console.log("resultuseEffect Bioooo", result);
                setBioText(result.data.bio);
                setBioExist(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            {bioExist && (
                <div className="bio">
                    <h6>
                        Tell us about your self :{" "}
                        <strong style={{ color: "blue", display: "inline" }}>
                            {userData.firstname} {userData.lastname}
                        </strong>
                    </h6>
                    <p className="bio-text">{bioText}</p>
                    <button className="edit-bio" onClick={updateBio}>
                        edit
                    </button>
                </div>
            )}

            {!bioExist && (
                <div className="bio">
                    <h6>Tell us about your self: </h6>
                    <textarea
                        className="bio-text"
                        name="bioText"
                        value={bioText}
                        onChange={changeInput}
                    ></textarea>
                    <button className="save-bio" onClick={handleSubmit}>
                        add
                    </button>
                </div>
            )}
        </div>
    );
}
