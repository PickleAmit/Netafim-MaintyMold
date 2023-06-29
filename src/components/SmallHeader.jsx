import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../features/userSlice";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { IconButton } from "@mui/material";

const SmallHeader = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.user.mode);
  return (
    <div className="small_header">
      <span>MaintyMold</span>
      <IconButton
        onClick={() => {
          dispatch(toggleMode());
        }}
        sx={{ position: "absolute", left: "0", top: "0.5%" }}
      >
        {mode === "dark" ? (
          <Brightness4Icon />
        ) : (
          <Brightness5Icon sx={{ color: "white" }} />
        )}
      </IconButton>
    </div>
  );
};

export default SmallHeader;
