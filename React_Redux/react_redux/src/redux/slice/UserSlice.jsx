import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    onPending: (state) => {
      state.user = null;
      state.loading = true;
      state.error = null;
    },
    onRejected: (state, action) => {
      state.user = null;
      state.loading = false; // Set loading to false here.
      state.error = action.payload;
    },
    onFulfilled: (state, action) => {
      state.user = action.payload;
      state.loading = false; // Set loading to false here.
      state.error = null;
    },
  },
});

// Make sure to export the user reducer properly
const userActions = userSlice.actions;
export { userActions };
export default userSlice; // Exporting userSlice with the .reducer property.
