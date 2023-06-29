import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getUrl from "../app/baseUrl";
const URL = getUrl();

// Async action to fetch all locations
export const getAllLocations = createAsyncThunk(
  "locations/fetchLocations",
  async () => {
    const response = await fetch(`${URL}/alllocations`, {
      method: "GET",
    });
    const json = await response.json();
    return json;
  }
);

export const addLocation = createAsyncThunk(
  "locations/addLocation",
  async (locationName) => {
    const response = await fetch(`${URL}/locations/new`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locationName: locationName,
      }),
    });
    const json = await response.json();
    return json;
  }
);

export const updateMoldLocation = createAsyncThunk(
  "locations/updateMoldLocation",
  async ({ moldId, locationName }) => {
    const response = await fetch(`${URL}/molds/${moldId}/location`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        LocationName: locationName,
      }),
    });
    const json = await response.json();
    return json;
  }
);

// Location slice
const locationSlice = createSlice({
  name: "locations",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateMoldLocation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMoldLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        // You may need to update the locations in the state if needed
      })
      .addCase(updateMoldLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default locationSlice.reducer;
