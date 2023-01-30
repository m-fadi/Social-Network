import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "privateChat",
    initialState: {
        PrivateChate: [],
    },
    reducers: {
        getChat: (state, action) => {
            console.log("get message action");
            state.messages = [...action.payload];
        },
        newChat: (state, action) => {
            console.log("get message action");
            // state.messages.push(action.payload);
            state.messages = [...state.messages, action.payload];
        },
    },
});
export const { getChat, newChat } = chatSlice.actions;
export default chatSlice.reducer;
