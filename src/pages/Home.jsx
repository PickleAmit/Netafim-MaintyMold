import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, selectUser } from "../features/userSlice";
import Header from "../components/Header";

import { BiGlassesAlt } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { RiFileSettingsLine } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { BiMapPin } from "react-icons/bi";
import { BsGraphUpArrow } from "react-icons/bs";

const Home = () => {
  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();

  const menuList = [
    {
      title: "צפייה בתקלות",
      icon: <BiGlassesAlt />,
      path: "/tickets",
      key: "34feb",
      showTo: ["Manager", "MoldRoomTechnician", "InjectionTechnician"],
    },
    {
      title: "הזנת אילוצים",
      icon: <BsCalendar3 />,
      path: "constraints",
      key: "914c0",
      showTo: ["InjectionTechnician", "MoldRoomTechnician"],
    },
    {
      title: "תקלות שלי",
      icon: <RiFileSettingsLine />,
      path: "/tickets/myTickets",
      key: "99df2",
      showTo: ["MoldRoomTechnician"],
    },
    {
      title: "מיקומי תבניות",
      icon: <BiMapPin />,
      path: "/moldlocation",
      key: "6794c",
      showTo: ["InjectionTechnician"],
    },
    {
      title: "פתיחת תקלה",
      icon: <AiOutlinePlus />,
      path: "/tickets/new/",
      key: "5794b",
      showTo: ["InjectionTechnician", "MoldRoomTechnician"],
    },
    {
      title: "הפקת דוחות",
      icon: <BsGraphUpArrow />,
      path: "/reports",
      key: "98yd2",
      showTo: ["Manager"],
    },
    {
      title: "ניהול תקלה",
      icon: <RiFileSettingsLine />,
      path: "/tickets/manager/",
      key: "po93y",
      showTo: ["Manager"],
    },
  ];

  return (
    <div className="home_container">
      {menuList
        .filter((item) => item.showTo.includes(user.AreaOfExpertise))
        .map((item) => (
          <Box
            variant="contained"
            key={item.key}
            component={Link}
            to={item.path}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              gap: 1,
              height: "13%",
              width: "65%",
              maxWidth: "450px",
              textDecoration: "none",
              fontSize: "1.5rem",
              padding: "1.5rem 2rem",
              m: 1,
              overflow: "hidden",
              borderRadius: 2,
              color: "white",
              backgroundColor: "#353750",
              "&:hover": {
                backgroundColor: "hsl(236, 20%, 16%)",
              },
            }}
          >
            {item.icon}
            <div
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              {item.title}
            </div>
          </Box>
        ))}
    </div>
  );
};

export default Home;
