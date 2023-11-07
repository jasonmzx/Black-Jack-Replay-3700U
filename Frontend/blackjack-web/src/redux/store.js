import { configureStore } from "@reduxjs/toolkit";

//Reducers 
import gameReducer from "./features/gameSlice";

export const store = configureStore({
    reducer : {
        game : gameReducer,
    }
});