import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  bottomModalIsOpen: false,
  // fullModalIsOpen: false,
};
export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openBottomModal: (state) => {
      state.bottomModalIsOpen = true;
    },
    closeBottomModal: (state) => {
      state.bottomModalIsOpen = false;
    },
    // openFullModal: (state) => {
    //     state.fullModalIsOpen = true;
    // },
    // closeFullModal: (state) => {
    //     state.fullModalIsOpen = false;
    // }
  },
});
export const {
  openBottomModal,
  closeBottomModal,
  //   openFullModal,
  //   closeFullModal,
} = modalSlice.actions;
export const selectModal = (state) => state.modal;
export default modalSlice.reducer;
