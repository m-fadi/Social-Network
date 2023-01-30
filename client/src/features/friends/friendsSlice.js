import {createSlice} from "@reduxjs/toolkit";
const initialState = [
  
];


export const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        declineRequest(state, action) {
            return state.filter((elem) => elem.id !== action.payload);
        },
        acceptRequest(state, action) {
            return state.map((elem) =>
                elem.id === action.payload? { ...elem, accepted: true } : elem
            );
        },
        
        receivedRequests:(state,action)=>{
           
            return [ ...action.payload];
        },
    },
});
export const { receivedRequests, acceptRequest, declineRequest } = friendsSlice.actions;
export default friendsSlice.reducer;
 
