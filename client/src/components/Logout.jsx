//import Welcome from "./welcome";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        fetch("/logout")
            .then((result) => result.json())
            .then(() => {
                //navigate("/login",{replace:true});
                location.replace("/login");
            });
    };
    
    return (
        <>
            <button className="logout-btn" onClick={handleLogout}>
                logOut
            </button>
        </>
    );
}


///okra66@example.com