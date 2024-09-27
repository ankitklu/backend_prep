import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slice/CounterSlice";
import counterInputSlice from "./slice/CounterInputSlice";
import userSlice from "./slice/UserSlice"; // Make sure the path is correct

// Ensure userSlice.reducer is properly used in the store
const store = configureStore({
  reducer: {
    counterState: counterSlice.reducer,
    counterInputState: counterInputSlice.reducer,
    userSection: userSlice.reducer, // Check the key name here
  },
});

export default store;
