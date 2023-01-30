import { Avatar, Image } from "antd";
import ChatInput from "./ChatInput";

// export default function Chat(props) {
//     console.log("props in the chat XXXXXX", props);
//     return (
//         <>
//             <div className="chat-container">
//                 <div className="chat">
//                     <ChatReceiver props={props} />
//                     <ChatSender props={props} />
//                 </div>
//                 <ChatInput props={props} />
//             </div>
//         </>
//     );
// }

function ChatReceiver(props) {
    const { avatar,message, user } = props;
    console.log("props in the reciver XXXXXX", props);
    return (
        <>
            <div className="chat-receiver">
                <Avatar
                    size={50}
                    src={
                        <Image
                            src={avatar}
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
                <p
                    style={{
                        padding: 10,
                        background: "#a6cf86",
                        borderRadius: 10,
                        maxWidth: "60%",
                        fontSize: 10,
                    }}
                >
                    <strong style={{ fontSize: 11 }}>{user}</strong>
                    <br></br>
                    {message}
                </p>
            </div>
            {/* <button onClick={() => handleChat()}>Chat</button>; */}
        </>
    );
}

function ChatSender(props) {
    console.log("props in the sender XXXXXX", props);
    const { avatar, message, user } = props;
    return (
        <>
            <div className="chat-sender">
                <p
                    style={{
                        padding: 10,
                        background: "white",
                        borderRadius: 10,
                        maxWidth: "60%",
                        fontSize: 10,
                    }}
                >
                    <strong style={{ fontSize: 11 }}>{user}</strong>
                    <br></br>
                    {message}
                </p>
                <Avatar
                    size={50}
                    src={
                        <Image
                            src={avatar}
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
            </div>
            {/* <button onClick={() => handleChat()}>Chat</button>; */}
        </>
    );
}
export { ChatReceiver, ChatSender };
