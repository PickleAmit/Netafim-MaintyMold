import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getErrors, selectErrors } from "../features/errorsSlice";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import "./ticketsList.css";
import { BiMapPin } from "react-icons/bi";
import formatDate from "../util/formatDate";
import ErrorFilter from "../components/ErrorFilter";

const TicketsManager = () => {
  const { data } = useSelector(selectErrors);
  const [filteredData, setFilteredData] = useState([]);

  const filterErrors = (filterValue) => {
    const filtered = data.filter((error) => {
      // Only show errors that don't have a 'leadingTechnician' or 'priorityDescription'.
      if (
        error.LeadingTechnician ||
        error.PriorityDescription ||
        error.ClosingDate !== null
      ) {
        return false;
      }
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
  }, [data]);

  return (
    <div className="tickets_list_container">
      <div className="myTickets_header">
        <Typography variant="h6" sx={{ color: "black" }}>
          ניהול תקלה
        </Typography>
      </div>
      <div className="el-temp">
        <ErrorFilter filterErrors={filterErrors} />
        <div className="errors_list">
          {filteredData.map((error) => (
            <span
              key={error.ErrorNumber}
              className={`errors_list_item ${error.PriorityDescription}`}
              onClick={() => {
                navigate(`/tickets/${error.ErrorNumber}`);
              }}
            >
              <Typography
                variant="h6"
                sx={{ marginLeft: "20px", color: "black" }}
              >
                {error?.MoldDesc} - {error?.ErrorNumber}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginLeft: "20px", color: "black" }}
              >
                {error?.Description}
              </Typography>

              <div className="error_list_stack">
                <div className="error_list_stack_child">
                  {error?.ClosingDate && (
                    <Typography variant="body2" sx={{ color: "black" }}>
                      נסגר ב- {formatDate(error.ClosingDate)}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "black",
                    }}
                  >
                    {error.LocationName} <BiMapPin size={18} />
                  </Typography>
                </div>
                <div className="error_list_stack_child">
                  <Typography variant="body2" sx={{ color: "black" }}>
                    נפתח ב- {formatDate(error.OpeningDate)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ direction: "ltr", color: "black" }}
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

export default TicketsManager;
