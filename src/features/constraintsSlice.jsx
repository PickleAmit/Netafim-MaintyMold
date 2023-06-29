import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getUrl from "../app/baseUrl";
const URL = getUrl();

export const getConstraintsByTechnician = createAsyncThunk(
  "user/getConstraintsByTechnician",
  async (technicianID) => {
    const response = await fetch(
      `${URL}/schedulingconstraints/technician/${technicianID}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    return json;
  }
);

export const setNewConstraint = createAsyncThunk(
  "user/setNewConstraint",
  async ({
    technicianID,
    description,
    constraintDate,
    constraintStartHour,
    constraintEndHour,
  }) => {
    const response = await fetch(`${URL}/schedulingconstraints/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TechnicianID: technicianID,
        Description: description,
        ConstraintDate: constraintDate,
        ConstraintStartHour: constraintStartHour,
        ConstraintEndHour: constraintEndHour,
      }),
    });
    const json = await response.json();
    return json;
  }
);

const initialState = {
  error: "",
  constraint: [],
  userConstraints: [],
};

export const constraintsSlice = createSlice({
  name: "constraints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setNewConstraint.fulfilled, (state, action) => {
        state.constraint = action.payload;
      })
      .addCase(setNewConstraint.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getConstraintsByTechnician.fulfilled, (state, action) => {
        state.userConstraints = action.payload;
      })
      .addCase(getConstraintsByTechnician.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const selectConstraints = (state) => state.constraints.userConstraints;

export default constraintsSlice.reducer;
