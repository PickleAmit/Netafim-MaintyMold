import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import SmallHeader from "./SmallHeader";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { AiOutlineHome } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import { BsFileText } from "react-icons/bs";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
  const mode = useSelector((state) => state.user.mode);
  return (
    <div className="app_layout">
      <SmallHeader />
      <div className="outlet_div">
        <Outlet />
      </div>
      <nav style={{ backgroundColor: mode === "dark" ? "#1b1b1b" : "#fff" }}>
        <IconButton component={Link} to="/">
          <AiOutlineHome />
        </IconButton>
        <IconButton component={Link} to="/tickets/new">
          <BsPlusCircle size={"2em"} />
        </IconButton>
        <IconButton
          onClick={() => {
            console.log(user);
            if (user.AreaOfExpertise === "Manager") {
              navigate("/reports");
            } else {
              navigate("/constraints");
            }
          }}
        >
          <BsFileText />
        </IconButton>
      </nav>
    </div>
  );
};

export default Layout;
