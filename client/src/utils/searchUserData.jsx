const searchUserData = ({
    userId,
    method,
    targetDataTable,

}) => {
    if (method === "search") {
        return fetch("/userData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                method,
                targetDataTable,
            }),
        })
            .then((result) => result.json())
           
            .catch((error) => {
                return {
                    success: false,
                    message: error,
                };
            });
    } else if (method == "delete") {
        return fetch(`/deleteUser`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, method, targetDataTable }), // pass the table want to delete from users table or relationships targetData is either search or delete
        })
            .then((result) => result.json())
            
            .catch((error) => {
                return {
                    success: false,
                    message: error,
                };
            });
    }
};

export default searchUserData;
