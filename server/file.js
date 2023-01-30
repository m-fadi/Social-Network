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
            console.log("result insert user db", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => {
            console.log("error");
            return { error: error };
        });
}
function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then((result) => {
            return result.rows[0];
        });
}

function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1 ", [email])
        .then((result) => {
            if (result.rowCount === 0) {
                return 0;
            }
            console.log("user by email db, ", result.rows[0]);
            return result.rows[0];
        })
        .catch((error) => console.log(error));
}

function deleteUser(id) {
    return db.query(`DELETE FROM users WHERE id=$1`, [id]).then();
}

function updateUserInfo({ firstName, lastName, email, user_id }) {
    return db.query(
        `UPDATE users SET firstname=$1,lastname=$2,email=$3 where id=$4
     RETURNING *`,
        [firstName, lastName, email, user_id]
    );
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
            console.log("password was updated", result.rows[0]);
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
            console.log(error);
            return {
                message: error,
                success: false,
            };
        });
}

function findPeople(name) {
    console.log("find people db before", name);
    return db
        .query(`SELECT * FROM users WHERE firstname  ILIKE $1 `, [name + "%"])
        .then((result) => {
            console.log("find people db result", result.rows);
            return result.rows;
        })
        .catch((err) => console.log(err));
}

module.exports = {
    createUser,
    deleteUser,
    getUserByEmail,
    getUserById,
    updateUserInfo,
    updateResetCode,
    getResetCode,
    updatePassword,
    insertImage,
    updateBio,
    findPeople,
};
