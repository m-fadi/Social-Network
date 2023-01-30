import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, Image } from "antd";
import { socket } from "./socket";
const Chat = (props) => {
    const { userData } = props;
    console.log(userData);
    const [message, setMessage] = useState("");

    const messages = useSelector((state) => state.chat.messages);
    console.log("messages ", messages);

   

    const addMessage = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
        socket.emit("chatMessage", message);

        setMessage("");
    };
    return (
        <div className="chat">
            {messages &&
                messages.map((message, index) => (
                    <div
                        className={
                            message.sender_id === userData.id
                                ? "chat-sender"
                                : "chat-receiver"
                        }
                        key={index}
                    >
                        <Avatar
                            size={50}
                            src={
                                <Image
                                    src={message.image_urls}
                                    style={{
                                        objectFit: "cover",
                                        width: 45,
                                        height: 45,
                                        borderRadius: "100%",
                                    }}
                                    preview={false}
                                />
                            }
                        />
                        <p>
                            <strong style={{ fontSize: 11 }}>
                                {message.firstname}
                            </strong>
                            <br></br>
                            {message.messages}
                        </p>
                    </div>
                ))}{" "}
            <div className="chat-input-container">
                <textarea
                    rows={6}
                    placeholder="write a message ..."
                    value={message}
                    className="chat-input-textarea"
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button className="chat-input-btn" onClick={addMessage}>
                    {" "}
                    send{" "}
                </button>
            </div>
        </div>
    );
};
export default Chat;
