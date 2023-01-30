import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "privateChat",
    initialState: {
        PrivateChate: [],
    },
    reducers: {
        getMessage: (state, action) => {
            console.log("get message action");
            state.messages = [...action.payload];
        },
        newMessage: (state, action) => {
            console.log("get message action");
            // state.messages.push(action.payload);
            state.messages = [ ...state.messages,action.payload];
        },
    },
    
});
export const { getMessage, newMessage } = chatSlice.actions;
export default chatSlice.reducer;
