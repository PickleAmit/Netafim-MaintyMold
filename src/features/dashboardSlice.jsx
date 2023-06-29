import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getUrl from "../app/baseUrl";

const URL = getUrl();

const createGetRequestThunk = (name, url) => {
  return createAsyncThunk(name, async ({ startDate = new Date()
      .toISOString()
      .split("T")[0], timePeriod = "all" }) => {
    try {
      const response = await fetch(
        `${url}?endDate=${startDate}&timePeriod=${timePeriod}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(
        " StartDate = " + startDate + " and timePerios = " + timePeriod
      );
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  });
};

export const fetchTypeCounts = createGetRequestThunk(
  "dashboard/fetchTypeCounts",
  `${URL}/errors/count-by-type`
);
export const fetchCountsByTechnician = createGetRequestThunk(
  "dashboard/fetchCountsByTechnician",
  `${URL}/errors/count-by-technician`
);
export const fetchAverageResolutionTime = createGetRequestThunk(
  "dashboard/fetchAverageResolutionTime",
  `${URL}/errors/average-resolution-time`
);
export const fetchCountByPriority = createGetRequestThunk(
  "dashboard/fetchCountByPriority",
  `${URL}/errors/count-by-priority`
);
export const fetchMostCommon = createGetRequestThunk(
  "dashboard/fetchMostCommon",
  `${URL}/errors/most-common`
);
export const fetchAverageResolutionByErrorType = createGetRequestThunk(
  "dashboard/fetchAverageResolutionByErrorType",
  `${URL}/errors/average-resolution-time-by-errortype`
);
export const fetchAverageResolutionByTechnician = createGetRequestThunk(
  "dashboard/fetchAverageResolutionByTechnician",
  `${URL}/errors/average-resolution-time-by-technician`
);

const initialState = {
  typeCounts: { data: [], loading: "idle", error: null },
  countsByTechnician: { data: [], loading: "idle", error: null },
  averageResolutionTime: { data: null, loading: "idle", error: null },
  countByPriority: { data: [], loading: "idle", error: null },
  mostCommon: { data: [], loading: "idle", error: null },
  averageResolutionByErrorType: { data: [], loading: "idle", error: null },
  averageResolutionByTechnician: { data: [], loading: "idle", error: null },
};

const updateLoading = (state, section) => {
  state[section].loading = "loading";
};

const updateData = (state, section, payload) => {
  state[section].loading = "idle";
  state[section].data = payload;
};

const updateError = (state, section, errorMessage) => {
  state[section].loading = "idle";
  state[section].error = errorMessage;
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeCounts.pending, (state) =>
        updateLoading(state, "typeCounts")
      )
      .addCase(fetchTypeCounts.fulfilled, (state, action) =>
        updateData(state, "typeCounts", action.payload)
      )
      .addCase(fetchTypeCounts.rejected, (state, action) =>
        updateError(state, "typeCounts", action.error.message)
      )

      .addCase(fetchCountsByTechnician.pending, (state) =>
        updateLoading(state, "countsByTechnician")
      )
      .addCase(fetchCountsByTechnician.fulfilled, (state, action) =>
        updateData(state, "countsByTechnician", action.payload)
      )
      .addCase(fetchCountsByTechnician.rejected, (state, action) =>
        updateError(state, "countsByTechnician", action.error.message)
      )

      .addCase(fetchAverageResolutionTime.pending, (state) =>
        updateLoading(state, "averageResolutionTime")
      )
      .addCase(fetchAverageResolutionTime.fulfilled, (state, action) =>
        updateData(state, "averageResolutionTime", action.payload)
      )
      .addCase(fetchAverageResolutionTime.rejected, (state, action) =>
        updateError(state, "averageResolutionTime", action.error.message)
      )

      .addCase(fetchCountByPriority.pending, (state) =>
        updateLoading(state, "countByPriority")
      )
      .addCase(fetchCountByPriority.fulfilled, (state, action) =>
        updateData(state, "countByPriority", action.payload)
      )
      .addCase(fetchCountByPriority.rejected, (state, action) =>
        updateError(state, "countByPriority", action.error.message)
      )

      .addCase(fetchMostCommon.pending, (state) =>
        updateLoading(state, "mostCommon")
      )
      .addCase(fetchMostCommon.fulfilled, (state, action) =>
        updateData(state, "mostCommon", action.payload)
      )
      .addCase(fetchMostCommon.rejected, (state, action) =>
        updateError(state, "mostCommon", action.error.message)
      )

      .addCase(fetchAverageResolutionByErrorType.pending, (state) =>
        updateLoading(state, "averageResolutionByErrorType")
      )
      .addCase(fetchAverageResolutionByErrorType.fulfilled, (state, action) =>
        updateData(state, "averageResolutionByErrorType", action.payload)
      )
      .addCase(fetchAverageResolutionByErrorType.rejected, (state, action) =>
        updateError(state, "averageResolutionByErrorType", action.error.message)
      )

      .addCase(fetchAverageResolutionByTechnician.pending, (state) =>
        updateLoading(state, "averageResolutionByTechnician")
      )
      .addCase(fetchAverageResolutionByTechnician.fulfilled, (state, action) =>
        updateData(state, "averageResolutionByTechnician", action.payload)
      )
      .addCase(fetchAverageResolutionByTechnician.rejected, (state, action) =>
        updateError(
          state,
          "averageResolutionByTechnician",
          action.error.message
        )
      );
  },
});

export default dashboardSlice.reducer;

export const selectTypeCounts = (state) => state.dashboard.typeCounts;
export const selectCountsByTechnician = (state) =>
  state.dashboard.countsByTechnician;
export const selectErrorCountByStatus = (state) =>
  state.dashboard.errorCountByStatus;
export const selectAverageResolutionTime = (state) =>
  state.dashboard.averageResolutionTime;
export const selectCountByPriority = (state) => state.dashboard.countByPriority;
export const selectMostCommon = (state) => state.dashboard.mostCommon;
export const selectAverageResolutionByErrorType = (state) =>
  state.dashboard.averageResolutionByErrorType;
export const selectAverageResolutionByTechnician = (state) =>
  state.dashboard.averageResolutionByTechnician;
