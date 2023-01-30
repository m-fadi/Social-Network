import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Register() {
    const [error, setError] = useState("");

    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    function handleChange(e) {
        if (e.target.value==="") setError("please fill the fields")
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [e.target.name]: e.target.value,
            };
        });
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log("About to submit the form!");
        console.log(formData);
        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log("results in app", result);
                if (result.success) {
                    navigate("/App")
                    location.reload();
                    setUserData(...userData, result.data);
                    console.log("userData at reg", userData);
                } else setError(result.message);
            });
    }

    return (
        <div>
            <h5 className="errorMessage">{error}</h5>
            <form onSubmit={handleSubmit} className="registration-form">
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange}
                    name="firstname"
                    className="register-input"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={handleChange}
                    name="lastname"
                    className="register-input"
                    required
                />
                <input
                    type="text"
                    placeholder="email"
                    onChange={handleChange}
                    name="email"
                    className="register-input"
                    required
                />
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="register-input"
                    required
                ></input>
                <button className="register-input"> Register </button>
            </form>
            <Link to="/login"> click here to log in</Link>
        </div>
    );
}
