//import Welcome from "./welcome";


export default function Delete(props) {
     const { toggleProfilePic } = props.tools;
    const handleDelete = () => {
        
        fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        })
            .then((result) => result.json())
            .then(() => {
                toggleProfilePic();
            });
    };

    return (
        <>
            <button className="uploader-btn" onClick={handleDelete}>
                Delete picture
            </button>
        </>
    );
}
