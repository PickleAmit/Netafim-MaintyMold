import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getUrl from "../app/baseUrl";

const URL = getUrl();

export const loginThunk = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const response = await fetch(`${URL}/employee/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email, Password: password }),
    });
    const json = await response.json();
    return json;
  }
);

const initialState = {
  id: null,
  isLoading: false,
  isError: false,
  error: "",
  mode: "light",
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.email = "";
      state.user = {};
    },
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.user = action.payload;
        state.id = action.payload.EmployeeID;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});


export const { logout, toggleMode } = userSlice.actions;
export const selectUser = (state) => state.user;
// export const selectMode = (state) => state.user.mode;
export default userSlice.reducer;
