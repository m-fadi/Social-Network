import { useState } from "react";
export default function ChatInput(props) {
   
    const [message, setMessage] = useState();
    const addMessage = () => {
        console.log("message imn input", message)
        props.sendMessage(message);
        setMessage("");
    };
    return (
        <div className="chat-input-container">
            <textarea
                rows={6}
                placeholder="write a message ..."
                value={message}
                className="chat-input-textarea"
                onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="chat-input-btn" onClick={()=>addMessage()}> send </button>
        </div>
    );
}
