export default function deleteData(userId, targetTable) {
    
    return (
        fetch(`/deleteData`, {
         
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetTable, userId }), // pass the table want to delete from users table or relationships targetData is either search or delete
        })
           
            .then((result) => result.json())
            .then((result) => {
               
                return result;
            })
            .catch((error) => {
                return {
                    success: false,
                    message: error,
                };
            })
    );
}
