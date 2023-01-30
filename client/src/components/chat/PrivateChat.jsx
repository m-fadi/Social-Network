import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { ChatSender, ChatReceiver } from "./SenderAndReceiver";
import ChatInput from "./ChatInput";
import { useParams } from "react-router-dom";
import searchUserData from "../../utils/searchUserData";

//import { socket } from "../../features/chat/socket";

export default function PrivateChat(props) {
    const { userData } = props;
    const { otherId } = useParams();
    const userId = userData.id;
    const intOtherId = parseInt(otherId);
    const [chats, setChats] = useState([]);
    const [otherUser, setOtherUser] = useState();
    const socketId =
        intOtherId + userId + (userId > intOtherId ? userId : intOtherId);

    useEffect(() => {
        io.connect().on(`${socketId}`, (data) => {
            if (data) {
                console.log("data in useeff PrivateChat socket", data);
                setChats(() => [...data]);
                console.log("chats in private Chat", chats);
            }

            searchUserData({
                otherId,
                method: "search",
                targetDataTable: "users",
            }).then((result) => {
                console.log("XXXXXXXXother User result"  , result);
                setOtherUser([...result]);
                console.log("XXXXXXXX other User", otherUser);
            });
        });
    }, [chats]);

    const addMessage = (message) => {
        let socket = io.connect();
        console.log("message fom input in privateChatin Chats map", message);

        setChats([{ message }, ...chats]);
        socket.emit("privateChat", `${message}+the otherId is /${otherId} `);
        const socketId =
            intOtherId + userId + (userId > intOtherId ? userId : intOtherId);
        socket.emit(`${socketId}`, message);
    };

    const chatList = chats.map((chat, index) => {
        console.log("messages in Chats map", chat.message);
        return userData.id === otherId ? (
            <ChatSender
                key={index}
                message={chat.messages}
                avatar={userData.images_url}
            />
        ) : (
            <ChatReceiver
                key={index}
                message={chat.messages}
                avatar={userData.image_urls}
            />
        );
    });

    return (
        <div className="chat-container">
            <div className="chat">{chatList}</div>
            <ChatInput sendMessage={addMessage} />
        </div>
    );
}
