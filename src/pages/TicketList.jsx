import { useDispatch, useSelector } from "react-redux";
import { getErrors, selectErrors } from "../features/errorsSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import "./ticketsList.css";
import { BiMapPin } from "react-icons/bi";
import React from "react";
import formatDate from "../util/formatDate";
import ErrorFilter from "../components/ErrorFilter";
const TicketList = () => {
  const { data } = useSelector(selectErrors);
  const mode = useSelector((state) => state.user.mode);
  const [filterOpen, setFilterOpen] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const filterErrors = (filterValue) => {
    const filtered = data
      .filter((item) => {
        if (!filterOpen) {
          return item.ErrorStatus === "Finished";
        } else {
          return item.ErrorStatus !== "Finished" && item.ClosingDate === null;
        }
      })
      .filter((error) => {
        const searchString = [
          error.Description,
          error.MoldDesc,
          error.LocationName,
          error.ErrorNumber,
          error.ErrorType,
          error.OpeningTechnicianName,
        ]
          .join(" ")
          .toLowerCase();

        return searchString.includes(filterValue.toLowerCase());
      });
    setFilteredData(filtered);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getErrors());
  }, []);

  useEffect(() => {
    filterErrors("");
  }, [data, filterOpen]);

  return (
    <div className="tickets_list_container">
      <div className="errors_row_container">
        <div
          className={`errors_row_div ${filterOpen && "open_error_bg"}`}
          onClick={() => {
            setFilterOpen(true);
          }}
        >
          <Typography variant="h5" color={mode === "dark" ? "black" : "black"}>
            תקלות פתוחות
          </Typography>
        </div>

        <div
          className={`errors_row_div ${!filterOpen && "open_error_bg"}`}
          onClick={() => {
            setFilterOpen(false);
          }}
        >
          <Typography variant="h5" color={ mode === "dark" ? "black" : "black"}>תקלות סגורות</Typography>
        </div>
      </div>
      <div className="el-temp">
        <ErrorFilter filterErrors={filterErrors} />
        <div className="errors_list">
          {filteredData.map((error) => (
            <span
              key={error.ErrorNumber}
              className={`errors_list_item ${
                filterOpen && error.PriorityDescription
              }`}
              onClick={() => {
                navigate(`/tickets/${error.ErrorNumber}`);
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginLeft: "20px",
                  color: mode === "dark" ? "#1b1b1b" : "#000",
                }}
              >
                {error?.MoldDesc} - {error?.ErrorNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginLeft: "20px",
                  color: mode === "dark" ? "#1b1b1b" : "#000",
                }}
              >
                {error?.Description}
              </Typography>

              <div className="error_list_stack">
                <div className="error_list_stack_child">
                  {error?.ClosingDate && (
                    <Typography
                      variant="body2"
                      sx={{ color: mode === "dark" ? "#1b1b1b" : "#000" }}
                    >
                      נסגר ב- {formatDate(error.ClosingDate)}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: mode === "dark" ? "#1b1b1b" : "#000",
                    }}
                  >
                    {error.LocationName} <BiMapPin size={18} />
                  </Typography>
                </div>
                <div className="error_list_stack_child">
                  <Typography
                    variant="body2"
                    sx={{ color: mode === "dark" ? "#1b1b1b" : "#000" }}
                  >
                    נפתח ב- {formatDate(error.OpeningDate)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      direction: "ltr",
                      color: mode === "dark" ? "#1b1b1b" : "#000",
                    }}
                  >
                    פותח התקלה: {error?.OpenTechnicianName}
                  </Typography>
                </div>
              </div>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList;
