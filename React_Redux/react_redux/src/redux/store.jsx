import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slice/CounterSlice";
import counterInputSlice from "./slice/CounterInputSlice";

const store= configureStore({
    reducer:{
        counterState: counterSlice.reducer,
        counterInputSlice: counterInputSlice.reducer
    }
});

export default store;