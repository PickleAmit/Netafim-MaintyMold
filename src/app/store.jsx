import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import errorsReducer from "../features/errorsSlice";
import modalReducer from "../features/modalSlice";
import constraintsReducer from "../features/constraintsSlice";
import locationReducer from "../features/locationSlice";
import dashboardReducer from "../features/dashboardSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    errors: errorsReducer,
    modal: modalReducer,
    constraints: constraintsReducer,
    locations: locationReducer,
    dashboard: dashboardReducer,
  },
});
