import React from "react";
import { Route, Routes } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { heIL } from "@mui/x-date-pickers";

//pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import TicketList from "./pages/TicketList";
import NewTicket from "./pages/NewTicket";
import TicketDetails from "./pages/TicketDetails";
import Constraints from "./pages/Constraints";
import MoldLocation from "./pages/MoldLocation";
import Reports from "./pages/Reports";
import TicketsManager from "./pages/TicketsManager";
import MyTickets from "./pages/MyTickets";

//components
import Layout from "./components/Layout";
import TicketLayout from "./components/TicketLayout";
import Loading from "./components/Loading";

const ProtectedRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="constraints" element={<Constraints />} />
      <Route path="tickets" element={<TicketLayout />}>
        <Route index element={<TicketList />} />
        <Route path=":id" element={<TicketDetails />} />
        <Route path="myTickets" element={<MyTickets />} />
        <Route path="new" element={<NewTicket />} />
        <Route path="manager" element={<TicketsManager />} />
      </Route>
      <Route path="moldlocation" element={<MoldLocation />} />
      <Route path="reports" element={<Reports />} />
    </Route>
  </Routes>
);

const App = () => {
  const { isLoading, id } = useSelector(selectUser);

  return isLoading ? (
    <Loading />
  ) : id ? (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={
        heIL.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <ProtectedRoutes />
    </LocalizationProvider>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} exact />
      <Route path="/*" element={<Login />} />
    </Routes>
  );
};

export default App;
