import { configureStore } from "@reduxjs/toolkit";

import friendsReducer from "../features/friends/friendsSlice";
import chatReducer from "../features/chat/chatSlice";
//import privateChatReducer from "../features/chat/privateChatSlice";

export const store = configureStore({
    reducer: {
        friends: friendsReducer,
        chat: chatReducer,
      //  privateChat: privateChatReducer,
    },
});
