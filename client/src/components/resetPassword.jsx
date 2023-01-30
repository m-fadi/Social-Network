import React from "react";

import { Link } from "react-router-dom";
import VerificationEmail from "./verificationEmail";

export default function ResetPassword() {
    const [error, setError] = React.useState("");
    const [stage, setStage] = React.useState("verifyEmail");
    const [formData, setFormData] = React.useState({ email: "" });

    function handleChange(e) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value,
            };
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        fetch("/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log("result vrify email", result);
                return result.success
                    ? setStage("sendCode")
                    : (setError(result.message), console.log(error));
            });
    }
    console.log(stage);
    if (stage === "sendCode") {
        return <VerificationEmail stage ={stage}/>;                                                                                                                                                                                                                                                                                                                        
    }
    return (
        <div>
            <h5 className="errorMessage">{error}</h5>

            <form onSubmit={handleSubmit} className="reset-form">
                <h4> please enter you Email:</h4>

                <input
                    type="text"
                    placeholder="email"
                    onChange={handleChange}
                    name="email"
                    className="log-input"
                />

                <button className="login-input" type="submit">
                    {" "}
                    validate{" "}
                </button>
            </form>
            <br />
            <Link to="/login"> back to login</Link>
        </div>
    );
}
