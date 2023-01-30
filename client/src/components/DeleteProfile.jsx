import deleteData from "../utils/deleteData";

function DeleteProfile(props) {
    const confirmDelete = () => confirm("Sure want to delete profile?") && true;

    const handleDeleteProfile = (id) => {
        console.log(`profile with user id: ${id} is about to be deleted`);
        if (confirmDelete()) {
            deleteData(id, "messages").then(() => {
                console.log("messages deleted");
                deleteData(id, "friendships").then(() => {
                    console.log("friendsships deleted");
                    deleteData(id, "users").then(()=>location.replace("/register"));
                });
            });

            
        }
    };
    return (
        <button className="btn" onClick={() => handleDeleteProfile(props.id)}>
            DeleteProfile
        </button>
    );
}

export default DeleteProfile;

//  deleteData(id, "friendships").then(() => {
//                 deleteData(id, "messages").then(() => {
//                     deleteData(id, "users").then(() => {
//                         location.replace("/register");
