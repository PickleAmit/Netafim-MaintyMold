import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getUrl from "../app/baseUrl";
const URL = getUrl();

export const selectErrorsIsLoading = (state) => state.errors.isLoading;

export const getErrors = createAsyncThunk("data/errors", async () => {
  const response = await fetch(`${URL}/error`, {
    method: "GET",
  });
  const json = await response.json();
  return json;
});

export const getMoldInfo = createAsyncThunk("data/moldInfo", async () => {
  const response = await fetch(`${URL}/molds`, {
    method: "GET",
  });
  const json = await response.json();
  return json;
});

export const updateMoldStatusAfterTreatment = createAsyncThunk(
  "data/molds/:id/status",
  async ({ moldId, MoldStatusAfterTreatment }) => {
    try {
      console.log(
        "UpdateMoldStatus " + MoldStatusAfterTreatment + " moldID - " + moldId
      );
      const response = await fetch(`${URL}/molds/${moldId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MoldStatusAfterTreatment: MoldStatusAfterTreatment,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
);

export const getErrorById = createAsyncThunk("data/errors/:id", async (id) => {
  const response = await fetch(`${URL}/error/${id}`, {
    method: "GET",
  });
  const json = await response.json();
  return json;
});

export const getErrorByTechId = createAsyncThunk(
  "data/errors/technician/:id",
  async (id) => {
    const response = await fetch(`${URL}/error/technician/${id}`, {
      method: "GET",
    });
    const json = await response.json();
    return json;
  }
);

export const setErrorStatusById = createAsyncThunk(
  "data/errors/:id/status",
  async ({ id, Description, MoldRoomTechnicianNumber, StatusName }) => {
    try {
      const response = await fetch(`${URL}/error/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          StatusName: StatusName,
          Description: Description,
          MoldRoomTechnicianNumber: MoldRoomTechnicianNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
);

export const setNewError = createAsyncThunk(
  "data/error/new",
  async ({ Description, Type, TechnicianID, MoldID, ErrorPicture }) => {
    try {
      // Remove the "data:image/jpeg;base64," prefix if it exsits
      const imageData = ErrorPicture
        ? ErrorPicture.replace(/^data:image\/[a-z]+;base64,/, "")
        : null;
      const payload = {
        Description: Description,
        Type: Type,
        TechnicianID: TechnicianID,
        MoldID: MoldID,
        ErrorPicture: imageData,
      };
      console.log("Request payload:", payload);
      const response = await fetch(`${URL}/error/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error occurred while setting new error:", error);
      throw error; // Rethrow the error so that createAsyncThunk can handle it
    }
  }
);

export const setCloseError = createAsyncThunk(
  "data/error/{errorNumber}/close",
  async ({ errorNumber, MoldRoomTechnicianNumber }) => {
    try {
      const payload = {
        Description: "סגירת תקלה",
        MoldRoomTechnicianNumber: MoldRoomTechnicianNumber,
        errorNumber: errorNumber,
        StatusName: "סגירת תקלה",
      };
      console.log("Request payload:", payload);
      const response = await fetch(`${URL}/error/${errorNumber}/close`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error occurred while setting new error:", error);
      throw error; // Rethrow the error so that createAsyncThunk can handle it
    }
  }
);

// Fetch request to update the priority and technician
export const updateErrorDetails = createAsyncThunk(
  "errors/updateErrorDetails",
  // description = red/yellow/green
  async ({ errorNumber, description, leadingTechnicianId }) => {
    const response = await fetch(`${URL}/error/${errorNumber}/priority`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Description: description,
        LeadingTechnicianId: leadingTechnicianId,
      }),
    });
    if (!response.ok) {
      throw new Error("Update failed");
    }
    return await response.json();
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  error: "",
  data: [],
  specificError: [],
  techErrors: [],
  molds: [],
};

export const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getErrors.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getErrors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(getErrors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(getErrorById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getErrorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.specificError = action.payload;
      })
      .addCase(getErrorById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(getErrorByTechId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getErrorByTechId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.techErrors = action.payload;
      })
      .addCase(getErrorByTechId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(setErrorStatusById.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(setErrorStatusById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(setNewError.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(setNewError.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(setCloseError.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(setCloseError.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(getMoldInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getMoldInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.molds = action.payload;
      })
      .addCase(getMoldInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(updateMoldStatusAfterTreatment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateMoldStatusAfterTreatment.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(updateMoldStatusAfterTreatment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(updateErrorDetails.pending, (state) => {
        state.loading = true;
        state.isError = false;
      })
      .addCase(updateErrorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        // Add logic to update state with response
      })
      .addCase(updateErrorDetails.rejected, (state) => {
        state.loading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
// export const {  } = userSlice.actions;

// export const selectEmail = (state) => state.user.email
export const selectErrors = (state) => state.errors;

export default errorsSlice.reducer;
