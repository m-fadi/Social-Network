import { io } from "socket.io-client";
import { getMessage, newMessage } from "./chatSlice";
export let socket;
export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        let socketId = "414";

        socket.on("chatMessages", (data) => {
            if (data) {
                console.log("data in socket.js chatMessagesS socket", data);
                store.dispatch(getMessage(data));
            }
        });
        // socket.on(`${socketId}`, (data) => {
        //     if (data) {
        //         console.log("data in socket.js PrivateChat socket", data);
        //         store.dispatch(getMessage(data));
        //     }
        // });
        socket.on("chatMessage", (data) => {
            console.log("data in onSocket ChatMessage", data);
            store.dispatch(newMessage(data));
        });
    }
};
