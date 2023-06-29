// import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./index.css";

const Loading = () => {
  return (
    // <div className="loader_container">
    //    {/* <span className="loader"/> */}
    //  </div>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
