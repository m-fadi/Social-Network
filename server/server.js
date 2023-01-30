/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();

const compression = require("compression");
const path = require("path");
require("dotenv").config();
const { PORT = 3001 } = process.env;
const { AWS_BUCKET_NAME } = process.env;
//const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const cookieParser = require("cookie-parser");
const s3 = require("./s3");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { db } = require("./database/db");

////////////////SES//////////////////////////
const { sendResetCode, resetCode } = require("./SES");

app.use(express.json());
app.use(express.urlencoded());
app.use(compression());
app.use(cookieParser());
////////////////SocketIo//////////////////////
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
app.use(
    cookieSession({
        secret: `I'm always hungry.`,
        maxAge: 1000 * 60 * 60 * 24 * 90,
    })
);
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, "..", "client", "public")));
const {
    createUser,
    getUserByEmail,
    getResetCode,
    updateResetCode,
    updatePassword,
    insertImage,
    getUserById,
    updateBio,
    deleteData,
    getUsersBy,
    searchFriendship,
    addFriend,
    deleteUserData,
    getUserData,
    addMessage,
    getMessageById,
    getMessages,
    getPrivateMessageById,
} = require("./database/db");

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("---------------------");
    next();
});
// app.use((req, res, next) => {
//     if (!req.session.userId && req.url != "/login" && req.url != "/sign_up") {
//         res.redirect("/");
//     } else {
//         next();
//     }
// });

app.get("/user/id.json", (req, res) => {
    console.log("session in Server", req.session);
    const { id } = req.session;
    res.status(200).json({
        userId: id,
        firstName: req.session.firstname,
    });
});

//--------------------------------Register-------------------------------------------------
app.post("/register", (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const { firstname, lastname, email } = req.body;

    const created_at = new Date();
    //console.log("insert user server before", firstname, lastname, email);
    createUser({ firstname, lastname, email, hashedPassword, created_at }).then(
        (result) => {
            console.log("result ", result);
            if (result.error) {
                return res.json({
                    success: false,
                    message: "something went Wrong!",
                });
            }
            req.session = { ...result };
            return res.json({
                success: true,
                data: result,
            });
        }
    );
});
//--------------------------------Login-------------------------------------------------

app.post("/login", (req, res) => {
    //console.log("req.bodyEmail server", req.body);
    const { password, email } = req.body;

    getUserByEmail(email).then((result) => {
        if (!result) {
            return res.json({
                success: false,
                message: "Email doesn't exist",
            });
        }
        //console.log("userData from getByEmail server", result);
        const comparePass = bcrypt.compareSync(password, result.password);
        //console.log("compare", comparePass);
        if (!comparePass) {
            return res.json({
                success: false,
                message: "Wrong password",
            });
        }
        req.session = { ...result };
        //console.log("session after login", req.session);
        return res.json({
            success: true,
            data: result.id,
        });
    });
});

//--------------------------------Logout-------------------------------------------------

app.get("/logout", (req, res) => {
    req.session = null;
    // console.log("logout session", req.session);
    return res.json({
        userId: null,
    });
});

//--------------------------------Reset-------------------------------------------------

app.post("/reset", (req, res) => {
    const { email } = req.body;

    getUserByEmail(email).then((result) => {
        if (!result) {
            //console.log("Email not exist server from db");
            return res.json({
                success: false,
                message: "Email doesn't exist",
            });
        }
        const { email } = result;
        req.session.email = email;
        sendResetCode("fadi.m.marouf@gmail.com")
            .then(() => {
                //console.log("the resetCode and email is:", resetCode, email);
                updateResetCode(email, resetCode).then((data) => {
                    return res.json({
                        success: true,
                        message: {
                            message: `email verified, reset code was sent to your Email:${data.email}`,
                        },
                    });
                });
            })
            .catch((err) => console.log(err));
    });
});
//--------------------------------verify resetCode-------------------------------------------------

app.post("/verifyCode", async (req, res) => {
    const { password, reset_code } = req.body;
    const { email } = req.session;
    try {
        const storedData = await getResetCode(email, reset_code);

        if (!storedData) {
            return res.json({
                success: false,
                message: "your code is not valid",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "something went wrong",
        });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const passwordUpdated = await updatePassword(email, hashedPassword);
        return res.json({
            success: true,
            message: "your Password was reset, you can log in!",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error,
        });
    }
});

//--------------------------------insert ProfileImg-------------------------------------------------

app.post("/profileImg", upload.single("image"), s3.upload, (req, res) => {
    const { id } = req.session;
    const { filename } = req.file;
    // console.log("AWS_BUCKET_NAME", AWS_BUCKET_NAME);
    const imgUrl = `https://s3.amazonaws.com/${AWS_BUCKET_NAME}/${filename}`;

    insertImage({ imgUrl, id }).then((result) => {
        //console.log("result inserted in server", result);
        return res.json({
            success: true,
            data: result.image_urls,
        });
    });
});

app.post("/delete", (req, res) => {
    const { id } = req.session;
    console.log("delete picture server before", id);

    deleteData(id).then((result) => {
        //console.log("result inserted in server", result);
        res.json({
            success: true,
        });
    });
});

//--------------------------------fetch userData on mount-------------------------------------------------
// this route is to interact(to delete or get data) with userData in any of the Tables decided by the targetTable variable passed from the frontEnd
app.post("/userData", (req, res) => {
    let { id } = req.session;
    /////////////////////////////////////////////try to uniform the userId (in frontEnd) and (myID)in server and db
    const { userId, method, targetDataTable, name, friendId, findUserProfile } =
        req.body;

    if (name === null || findUserProfile === true || userId === null) {
        // do searchById for first login or onLoading we need to check for id in start
        id = userId ? userId : id; // if signal coming from {FriendProfile(userProfile:true) or from App name==null} => make search on id only.

        getUserById(id, targetDataTable)
            .then((result) => {
                if (result) {
                    console.log("result from get by Id for server", result);

                    return res.json({
                        success: true,
                        data: result,
                    });
                } else {
                    return res.json({
                        error: "Something went wrong..",
                        success: false,
                    });
                }
            })
            .catch((err) => console.log("error in /userData server", err));
    } else if (method === "search") {
        // //////check methode Delete or search
        getUserData(userId, id, targetDataTable)
            .then((result) => {
                /////// if the method passed from F.ED is search => get the usersData if exist or 0
                //console.log(result);
                if (result) {
                    // console.log(result);

                    return res.json({
                        success: true,
                        data: result,
                    });
                } else {
                    return res.json({
                        data: 0,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.json({
                    error: "Something went wrong!!",
                    success: false,
                });
            });
    }
});

app.post("/deleteData", (req, res) => {
    let { id } = req.session;
    /////////////////////////////////////////////try to uniform the userId (in frontEnd) and (myID)in server and db
    let { userId, targetTable } = req.body;
    if (targetTable === "users") {
        req.session = null;
    }
    userId = userId ? userId : id; // if there is an userId sent with body => ide=userId
    console.log(
        "data befor delete user in server",
        userId,
        id,
        targetTable,
        req.body,
        req.session
    );
    deleteUserData(userId, id, targetTable)
        .then((result) => {
            if (!result) {
                return res.json({
                    success: true,
                    data: result,
                });
            } else {
                return res.json({
                    error: "Something went wrong..",
                    success: false,
                });
            }
        })
        .catch((err) => console.log(err));
});

//--------------------------------fBio-------------------------------------------------

app.post("/update_bio", (req, res) => {
    const id = req.session.id;
    const bio = req.body.bioText;
    //console.log("bio text and Id in server before", bio, id);
    updateBio(bio, id)
        .then((result) => {
            //console.log("result updateBio in server", result);
            return res.json({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.json({
                error: "Something went wrong!!",
                success: false,
            });
        });
});

app.post("/findPeople/users", (req, res) => {
    const myId = req.session.id;
    let searchTerm = req.body.name;
    console.log(searchTerm);
    //`${searchTerm}`// searchTerm is either "date"=> the query will be get first 3 users by create_atDESC, or searchTerm is the values epf the input
    getUsersBy(searchTerm).then((result) => {
        if (result) {
            return res.json({
                success: true,
                data: result,
                myId,
            });
        } else {
            return res.json({
                error: "Something went wrong..",
                success: false,
            });
        }
    });
});

app.post("/addRelation", async (req, res) => {
    const { id } = req.session;
    let { userId, relationStatus } = req.body;

    let accepted = relationStatus === "friends" ? true : null; // accepted will be true only if friend request is accepted
    userId = userId ? userId : id; // when using the addRelation to insert user into users table => must put userId(which would be the other friend id when adding to friendships table) to id
    console.log("relationStatussss server before", { userId, relationStatus });
    console.log("relationStatussss", userId, id, accepted);
    try {
        const relationData = await addFriend(userId, id, accepted);
        console.log("result addRelation server after", relationData);
        return res.json({
            success: true,

            data: relationData,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "something went wrong",
        });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//////////////////////////Socket Connection//////////////////
io.on("connection", (socket) => {
    console.log(
        "[social:socket] incoming socket connection >>>>>>>>>>>>>>>",
        socket.id
    );
    console.log(socket.request.session);
    const { id } = socket.request.session;

    if (!id) {
        return socket.disconnect(true);
    }

    // get the latest 10 messages
    getMessages({ chat: "broadCast" }).then((result) => {
        console.log("the result of getMessages server", result);
        socket.emit("chatMessages", result);
    });

    /////////////////////////////////////////privateChat///////////////////////

    // set isprivate to default false if not true

    socket.on("privateChat", (message) => {
        let isPrivate = true;
        // let msg =  extract the message and save it db
        // extract the id from message then open channel with id of id and other id and convert all chats with id privat
        let otherId = message.split("/")[message.split("/").length - 1];
        const otherIdInt = parseInt(otherId);
        const socketId = otherIdInt + id + (id > otherIdInt ? id : otherIdInt);
        console.log("socketId", socketId);
        getMessages({ chat: "private" }).then((result) => {
            console.log("the result of getMessages private server", result);
            socket.emit(`${socketId}`, result);
        });

        socket.on(`${socketId}`, (msg) => {
            console.log("private", msg);
        });
        if (message.trim() !== "") {
            console.log("in add msg db before server", {
                id,
                message,
                isPrivate,
                otherIdInt,
            });
            addMessage({ id, message, isPrivate, otherIdInt })
                .then((result) => {
                    getPrivateMessageById({
                        id,
                        otherIdInt,
                        isPrivate: true,
                    }).then((result) => {
                        // console.log(
                        //     "result in getPrivateMessages server after ",
                        //     result
                        // );
                        io.emit(`${socketId}`, result);
                    });
                })
                .catch((err) => {
                    console.log("there is an error :/", err);
                });
        } else {
            io.emit("error", "Message can't be empty!");
        }
    });
    ////////////////////////////////////BroadCast/////////////////////////////
    // listen for when the connected user sends a message
    socket.on("chatMessage", (message) => {
        console.log("message", message);
        if (message.trim() !== "") {
            addMessage({ id, message, isPrivate: false, otherId: null })
                .then((result) => {
                    getMessageById({ id: result.id }).then((result) => {
                        // console.log("result get message ChatMessage", result);
                        io.emit("chatMessage", result[0]);
                    });
                })
                .catch((err) => {
                    console.log("there is an error :/", err);
                });
        } else {
            io.emit("error", "Message can't be empty!");
        }
    });
});
server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});

// https://s3.amazonaws.com/spiceLing/595fabe891c5b0ba46b24422d4d21859
