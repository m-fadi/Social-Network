import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";


export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>

            <img
                className="logo-img"
                
                src="../images/logo.jpeg"
            />
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Register />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route
                            path="/resetPassword"
                            element={<ResetPassword />}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}
