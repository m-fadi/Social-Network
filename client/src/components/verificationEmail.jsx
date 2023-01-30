import { useState } from "react";
import { Link } from "react-router-dom";
export default function VerificationEmail(props) {
    const [stage, setStage] = useState(props.stage);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        reset_code: "",
        password: "",
    });


    function handleSubmit(e) {
        e.preventDefault();

        fetch("/verifyCode", {
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
                    ? setStage("reseted")
                    : (setError(result.message), console.log(error));
            });
    }
    function handleChange(e) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value,
            };
        });
    }

    switch (stage) {
        case "sendCode":
            return (
                <form onSubmit={handleSubmit} className="login-form">
                    <h5 className="errorMessage">{error}</h5>
                    <h5 className=""> Please enter the code, and a new password:</h5>
                    <input
                        type="text"
                        placeholder="Code"
                        onChange={handleChange}
                        name="reset_code"
                        className="log-input"
                    />

                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder=" New Password"
                        className="login-input"
                    ></input>
                    <button className="login-input" type="submit">
                        {" "}
                        reset{" "}
                    </button>
                </form>
            );

        case "reseted":
            return (
                <h1>
                    {" "}
                    Your password was succefully reseted, you can log in
                    <Link to="/login"> back to login</Link>
                </h1>
                // <StageSuccess
                //     changeHandler={this.handleInputChange}
                //     submitHandler={(e) => {
                //         this.handleSubmit(e);
                //     }}
                // ></StageSuccess>
            );

        default:
            console.log("default stage");
    }
}
