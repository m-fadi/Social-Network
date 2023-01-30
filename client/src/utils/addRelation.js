const addRelation = (userId, relationStatus) => {
    return fetch(`/addRelation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            relationStatus,
            
            
        }), // pass the table want to delete from users table or relationships targetData is either search or delete
    }).then(result=> result.json())
        
        .catch((error) => {
            return {
                success: false,
                message: error,
            };
        });
};

export default addRelation;
