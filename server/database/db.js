const spicedPg = require("spiced-pg");
require("dotenv").config();
const { USER, PASSWORD, DATABASE } = process.env;

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${USER}:${PASSWORD}@localhost:5432/${DATABASE}`
);

function createUser({
    firstname,
    lastname,
    email,
    hashedPassword,
    created_at,
}) {
    return db
        .query(
            `INSERT INTO users (firstname, lastname, email,password,created_at)
            VALUES ($1, $2, $3,$4,$5)
            RETURNING *`,
            [firstname, lastname, email, hashedPassword, created_at]
        )
        .then((result) => {
            // console.log("result insert user db", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => {
            console.log("error");
            return { error: error };
        });
}

function getUserById(id, targetDataTable) {
    if (targetDataTable == "users") {
        return db
            .query("SELECT * FROM users WHERE id = $1", [id])
            .then((result) => {
                if (!result.rowCount) {
                    return 0;
                }
                return result.rows[0];
            })
            .catch((err) => console.log("error in getUserById db 44", err));
    } else if (targetDataTable === "join") {
        console.log("in db getUserById join table", { id, targetDataTable });
        return db
            .query(
                `SELECT users.id, firstname, lastname, image_urls, accepted, sender_id
        FROM friendships
        JOIN users 
        ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = False AND sender_id = $1 AND recipient_id = users.id) 
        OR (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id) 
        OR (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`,
                [id]
            )

            .then((result) => {
                console.log("result  db getUserById join table", result.rows);
                if (!result.rowCount) {
                    return 0;
                }
                return result.rows;
            })
            .catch((err) => console.log("error in getUserById db 57", err));
    }
}

function getUserData(userId, id, targetDataTable) {
    if (targetDataTable === "friendships") {
        console.log("search in friendShips Table");
        return db
            .query(
                "SELECT * FROM friendships WHERE (sender_id=$1 AND recipient_id =$2) OR (sender_id=$2 AND recipient_id =$1)  ",
                [userId, id]
            )
            .then((result) => {
                //console.log("result GetUser FRIENDSHIPS DB", result);
                if (!result.rowCount) {
                    return 0;
                } else {
                    return result.rows[0];
                }
            });
    }
    if (targetDataTable === "users") {
        console.log("search in USERS Table");
        return db
            .query("SELECT * FROM users WHERE id = $1", [id])
            .then((result) => {
                //console.log("result GetUser USERS DB", result);
                if (!result.rowCount) {
                    return 0;
                } else {
                    return result.rows[0];
                }
            });
    }
}

function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1 ", [email])
        .then((result) => {
            if (result.rowCount === 0) {
                return 0;
            }
            // console.log("user by email db, ", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => console.log(error));
}

// function deleteUser(id) {
//     return db.query(`DELETE FROM users WHERE id=$1`, [id]).then();
// }

function updateUserInfo({ firstName, lastName, email, user_id }) {
    return db.query(
        `UPDATE users SET firstname=$1,lastname=$2,email=$3 where id=$4
     RETURNING *`,
        [firstName, lastName, email, user_id]
    );
}

function deleteUserData(userId, id, targetDataTable) {
    console.log("deleteUserData db before", userId, id, targetDataTable);
    if (targetDataTable === "friendships") {
        return db
            .query(
                `delete FROM friendships WHERE   (sender_id=$2 AND recipient_id =$1) OR (sender_id=$1 AND recipient_id =$2)
     `,
                [userId, id]
            )
            .then((result) => {
                if (!result.rowsCount) {
                    console.log("friendships 0 deleted");
                    return 0;
                } else {
                    console.log("friendships deleted");
                    return result.rows[0];
                }
            });
    } else if (targetDataTable === "users") {
        return db
            .query(
                `DELETE  FROM users where id=$1
     RETURNING *`,
                [id]
            )
            .then((result) => {
                if (!result.rowsCount) {
                    console.log("user 0 deleted");
                    return 0;
                } else return result.rows[0];
            });
    } else if (targetDataTable === "messages") {
        return db
            .query(
                `DELETE  FROM messages where  (sender_id=$1 ) OR (otherId=$1)
     RETURNING *`,
                [id]
            )
            .then((result) => {
                if (!result.rowsCount) {
                    console.log("messages 0 deleted");
                    return 0;
                } else return result.rows[0];
            });
    }
}

function updateResetCode(email, reset_code) {
    if (!email || !reset_code) {
        return 0;
    }
    console.log("email,resetCode in db", email, reset_code);
    return db
        .query(
            ` INSERT INTO reset_codes(email,reset_code) 
    VALUES ($1, $2) 
    ON CONFLICT (email) 
    DO UPDATE SET email=$1,reset_code=$2, created_at=CURRENT_TIMESTAMP
    RETURNING *`,
            [email, reset_code]
        )
        .then((result) => result.rows[0])
        .catch((error) => console.log(error));
}
function getResetCode(email, reset_code) {
    return db
        .query(
            "SELECT * FROM reset_codes WHERE email = $1 AND reset_code= $2 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' ",
            [email, reset_code]
        )
        .then((result) => result.rowCount)
        .catch((error) => console.log("XXXXXXXXXX", error));
}

function updatePassword(email, password) {
    console.log("password updated 1", password, email);

    return db
        .query(
            ` UPDATE users SET password=$1  where email=$2
    
    RETURNING *`,
            [password, email]
        )
        .then((result) => {
            // console.log("password was updated", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => {
            console.log(error);
        });
}
function insertImage({ imgUrl, id }) {
    console.log("imgUrl before insert", imgUrl, id);
    return db
        .query(
            ` UPDATE users SET image_urls=$1  where id=$2
            
            RETURNING *`,
            [imgUrl, id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => {
            return {
                message: error,
                success: false,
            };
        });
}

function updateBio(bio, id) {
    console.log("bio, id", bio, id);
    return db
        .query(
            `update users set bio=$1 WHERE id=$2 
    RETURNING *`,
            // eslint-disable-next-line indent
            [bio, id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((error) => {
            console.log("error at / 237", error);
            return {
                message: error,
                success: false,
            };
        });
}

function getUsersBy(searchTerm) {
    if (searchTerm !== "date") {
        return db
            .query(`SELECT * FROM users WHERE firstname  ILIKE $1 `, [
                searchTerm + "%",
            ])
            .then((result) => {
                //console.log("find peopleBYName db result", result.rows);
                return result.rows;
            })
            .catch((err) => console.log("error at / 255", err));
    } else {
        return db
            .query("SELECT * FROM users order by created_at DESC LIMIT 4")
            .then((result) => {
                // console.log("find peopleBYDATE db result", result.rows);
                return result.rows;
            })
            .catch((err) => console.log("error at / 263", err));
    }
}

function deleteData(id) {
    console.log("delete picture db before", id);
    return db
        .query("UPDATE users set image_urls =null   WHERE id=$1 ", [id])
        .then((result) => {
            // console.log("find peopleBYDATE db result", result.rows);
            return result.rows;
        })
        .catch((err) => console.log("error at / 292", err));
}

function searchFriendship(friendId, myId) {
    return db
        .query(
            `SELECT * FROM friendships where recipient_id=$1 AND sender_id=$2  `,
            [friendId, myId]
        )
        .then((result) => {
            if (result.rowCount === 0) {
                return 0;
            } else {
                return result.rows[0];
            }
        })
        .catch((err) => {
            console.log("error at search friend/ 292", err);
        });
}
function addFriend(userId, id, accepted) {
    if (accepted) {
        return db
            .query(
                `update friendships set accepted=$3 WHERE recipient_id=$2 AND sender_id=$1 OR recipient_id=$1 AND sender_id=$2
    RETURNING *`,
                [userId, id, accepted]
            )
            .then((result) => {
                console.log("result add friend db", result.rows);
                return result.rows[0];
            })
            .catch((err) => {
                console.log("error at addMessage/ 311", err);
            });
    } else {
        accepted = false;

        return db
            .query(
                `INSERT INTO friendships (recipient_id, sender_id, accepted)
            VALUES ($1, $2, $3)
            RETURNING *`,
                [userId, id, accepted]
            )
            .then((result) => {
                console.log("result add friend db", result.rows[0]);
                return result.rows[0];
            })
            .catch((err) => {
                console.log("error at addFriend/ 333", err);
            });
    }
}

/////////////// Chatting Functions////////////////////
function addMessage({ id, message, isPrivate, otherIdInt }) {
    let otherId = otherIdInt ? otherIdInt : null;

    console.log("in add msg db before", { id, message, isPrivate, otherId });
    return db
        .query(
            `INSERT INTO messages (sender_id,otherId, messages, isPrivate)
        VALUES ($1,$4, $2,$3)
        RETURNING *;
        `,
            [id, message, isPrivate, otherId]
        )
        .then((result) => {
            console.log("in add msg db after ", result.rows[0]);
            return result.rows[0];
        })
        .catch((err) => console.log("error at addMessage", err));
}

function getMessages({chat}) {
    if (chat !== "private") {
        return db
            .query(
                `SELECT firstname, lastname, image_urls, sender_id, messages, messages.id, isPrivate,otherId,
         TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS create_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id AND isPrivate=false
        ORDER BY messages.created_at
        LIMIT 10`
            )
            .then((result) => {
                console.log("result getMessages db", result.rows[0]);
                return result.rows;
            })
            .catch((err) => console.log("error at getMessages / 1", err));
    } else {
        return db
            .query(
                `SELECT firstname, lastname, image_urls, sender_id, messages, messages.id, isPrivate,otherId,
         TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS create_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id AND isPrivate=true
        OR messages.otherId = users.id AND isPrivate=true
        ORDER BY messages.created_at
        LIMIT 10`
            )
            .then((result) => {
                console.log("result getMessages private db/2", result.rows[0]);
                return result.rows;
            });
    }
}

// ( (messages.sender_id = $1 AND messages.otherId = $2)OR (messages.sender_id = $2 AND messages.otherId = $1)) AND
//TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS create_at

// ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id)
//         OR (accepted = False AND sender_id = $1 AND recipient_id = users.id)
//         OR (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id)
//         OR (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`,
function getPrivateMessageById({ id, otherIdInt, isPrivate }) {
    console.log("get privateMessagesById db before ", {
        id,
        otherIdInt,
        isPrivate,
    });
    return db
        .query(
            `SELECT users.firstname, users.lastname, users.image_urls, messages.sender_id, messages.messages, messages.isPrivate,messages.otherId,
         TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS create_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id 
        where (messages.sender_id = $2 AND messages.otherId = $1 AND messages.isPrivate= TRUE)
        OR (messages.sender_id = $1 AND messages.otherId = $2 AND messages.isPrivate= TRUE)
        ORDER BY messages.created_at DESC
        
        LIMIT 10`,
            [id, otherIdInt]
        )
        .then((result) => {
            console.log("result getPrivateMessageById db", result.rows[0]);
            return result.rows;
        })
        .catch((err) => console.log("error at getPrivateMessageById / 1", err));
}

function getMessageById({ id }) {
    return db
        .query(
            `SELECT firstname, lastname, image_urls, sender_id, messages, messages.id, isPrivate,otherId,
        TO_CHAR(messages.created_at, 'DD/MM/YYYY, HH24:MI:SS') AS create_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id
        WHERE messages.id = $1;`,
            [id]
        )
        .then((result) => result.rows)
        .catch((err) => console.log("error at getMessageById / 2", err));
}
module.exports = {
    createUser,
    // deleteUser,
    getUserByEmail,
    getUserById,
    updateUserInfo,
    updateResetCode,
    getResetCode,
    updatePassword,
    insertImage,
    updateBio,
    getUsersBy,
    deleteData,
    searchFriendship,
    addFriend,
    deleteUserData,
    getUserData,
    addMessage,
    getMessageById,
    getMessages,
    getPrivateMessageById,
};
