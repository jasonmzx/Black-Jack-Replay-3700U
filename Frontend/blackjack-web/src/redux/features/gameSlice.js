import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_log : []
}

export const gameSlice = createSlice(
    {
        name: 'game',
        initialState,
        reducers: {

           edit_key : (state,action) => {

           }
        }
    }
)

export const { edit_key } = gameSlice.actions;

export default gameSlice.reducer;