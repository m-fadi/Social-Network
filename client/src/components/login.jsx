import React from "react";
import { Link } from "react-router-dom";
import VerificationEmail from "./verificationEmail";

export default function Login() {
    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

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

        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log("results in app", result.data);
                return result.success
                    ? location.replace("/") //location.reload() /////////////////////////How ??????
                    : setError(result.message);
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="login-form">
                <h5 className="errorMessage">{error}</h5>
                <input
                    type="text"
                    placeholder="email"
                    onChange={handleChange}
                    name="email"
                    className="log-input"
                />

                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="login-input"
                ></input>
                <button className="login-input" type="submit">
                    {" "}
                    Login{" "}
                </button>
            </form>
            <br />
            <Link to="/register"> click here to register</Link>
            <br />
            <br />
            <Link to="/resetPassword">
                {" "}
                Forgot you password ? click to reset
            </Link>
        </div>
    );
}
