import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import Loading from "../components/Loading";
import formatDate from "../util/formatDate";
import { selectErrorsIsLoading } from "../features/errorsSlice";
import { ToasterPopup, useToastPopup } from "../components/ToasterPopup";

import { selectUser } from "../features/userSlice";
import {
  getErrorByTechId,
  setErrorStatusById,
  setCloseError,
} from "../features/errorsSlice";
//icons
import { AiOutlineSetting } from "react-icons/ai";
import { BiShare } from "react-icons/bi";

//ErrorFilter
import ErrorFilter from "../components/ErrorFilter";

const btnStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  fontSize: "18px",
};

const MyTickets = () => {
  const { user } = useSelector(selectUser);
  const specificError = useSelector((state) => state.errors.techErrors);
  const isLoading = useSelector(selectErrorsIsLoading);
  const dispatch = useDispatch();
  const [sortedSpecificError, setSortedSpecificError] = useState([]);

  const { showErrorToast } = useToastPopup();
  const navigate = useNavigate();
  const statusOrder = ["Waiting for treatment", "In treatment", "Finished"];

  useEffect(() => {
    dispatch(getErrorByTechId(user.EmployeeID));
  }, []);

  useEffect(() => {
    setSortedSpecificError(groupErrorsByStatus(specificError));
  }, [specificError]);

  const groupErrorsByStatus = (errors) => {
    const groupedErrors = {
      "Waiting for treatment": [],
      "In treatment": [],
      Finished: [],
    };

    errors.forEach((error) => {
      if (
        error.ErrorStatus === null ||
        error.ErrorStatus === "Waiting for treatment"
      ) {
        groupedErrors["Waiting for treatment"].push(error);
      } else {
        groupedErrors[error.ErrorStatus].push(error);
      }
    });

    return groupedErrors;
  };

  const filterErrors = (filterValue) => {
    const filteredErrors = specificError.filter((error) => {
      const searchString = [
        error.ErrorDescription,
        error.MoldDescription,
        error.MoldLocation,
        error.ErrorNumber,
        error.ErrorType,
        error.OpeningTechnicianName,
      ]
        .join(" ")
        .toLowerCase();

      return searchString.includes(filterValue.toLowerCase());
    });

    setSortedSpecificError(groupErrorsByStatus(filteredErrors));
  };

  //sorts the errors based on statusOrder
  const sortErrors = (errors) => {
    if (Array.isArray(errors)) {
      return [...errors].sort((a, b) => {
        return (
          statusOrder.indexOf(a.ErrorStatus) -
          statusOrder.indexOf(b.ErrorStatus)
        );
      });
    } else if (errors && errors.StatusErrors) {
      return [...errors.StatusErrors].sort((a, b) => {
        return (
          statusOrder.indexOf(a.ErrorStatus) -
          statusOrder.indexOf(b.ErrorStatus)
        );
      });
    } else {
      return ["No errors in Data base or problem in function"];
    }
  };

  //Changes status to "In treatment"
  const handleInTreatmentClick = useCallback(
    async (ticket) => {
      if (
        ticket.ErrorStatus === "Waiting for treatment" ||
        ticket.ErrorStatus === null
      ) {
        try {
          await dispatch(
            setErrorStatusById({
              id: ticket.ErrorNumber,
              StatusName: "תחילת טיפול",
              Description: "תחילת טיפול",
              MoldRoomTechnicianNumber: user.EmployeeID,
            })
          );
        } catch (error) {
          console.log("Error setting error status:", error);
        }
      } else showErrorToast("התקלה כבר בטיפול או טופלה");
    },
    [dispatch, user.EmployeeID]
  );

  // Closes the error and sets status to "finished"
  const handleCloseErrorClick = useCallback(
    async (ticket) => {
      if (
        ticket.ErrorStatus === "In treatment" ||
        ticket.ErrorStatus === null
      ) {
        try {
          await dispatch(
            setCloseError({
              errorNumber: ticket.ErrorNumber,
              MoldRoomTechnicianNumber: user.EmployeeID,
            })
          );
        } catch (error) {
          console.log("Error closing error:", error);
        }
      } else showErrorToast("לא ניתן לסגור תקלה שלא התחילה טיפול/טופלה");
    },
    [dispatch, user.EmployeeID]
  );

  return (
    <div className="myTickets_container">
      <div className="myTickets_header">
        <ToasterPopup />
        <Typography variant="h6" color="black">תקלות שלי</Typography>
      </div>
      <ErrorFilter filterErrors={filterErrors} />
      {isLoading ? (
        <Loading />
      ) : (
        Object.entries(sortedSpecificError).map(([status, errors]) => (
          <div key={status}>
            <Typography variant="h6"  sx={{ textAlign: "center" }}>
              {status}
            </Typography>
            <hr width="50%" color="#f5f5f5" />
            {errors.map((ticket) => (
              <div key={ticket.ErrorNumber} style={{ margin: "0.5rem" }}>
                <div
                  className={`myTickets_ticket ${ticket.PriorityName}`}
                  onClick={() => {
                    navigate(`/tickets/${ticket.ErrorNumber}`);
                  }}
                >
                  <Typography variant="subtitle1" color="black">
                    <b>
                      {ticket.MoldDescription} - {ticket.ErrorNumber}
                    </b>
                  </Typography>
                  <Typography variant="body1" color="black">
                    {ticket.ErrorDescription}
                  </Typography>
                  <Typography variant="body1" color="black">
                    פותח התקלה - {ticket.OpeningTechnicianName}
                  </Typography>
                  <Typography variant="body1" color="black">
                    נפתח - {formatDate(ticket.OpeningDate)}
                  </Typography>
                  <Typography variant="body1" color="black">
                    {ticket.leadingTechnicianName
                      ? `טכנאי מוביל - ${ticket.leadingTechnicianName}`
                      : ""}
                  </Typography>
                  <Typography variant="body1" color="black">
                    {ticket.ErrorStatus ? `סטטוס - ${ticket.ErrorStatus}` : ""}
                  </Typography>
                </div>
                <div className="myTickets_buttons">
                  <Button
                    variant={
                      ticket.ErrorStatus === "In treatment"
                        ? "contained"
                        : "outlined"
                    }
                    fullWidth
                    sx={btnStyle}
                    color={
                      ticket.ErrorStatus === "In treatment" ? "warning" : "info"
                    }
                    disabled={isLoading}
                    onClick={() => handleInTreatmentClick(ticket)}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <AiOutlineSetting size={20} />
                    )}
                    {isLoading ? "Loading..." : "בטיפול"}
                  </Button>

                  <Button
                    variant={
                      ticket.ErrorStatus === "Finished"
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      ticket.ErrorStatus === "Finished" ? "success" : "info"
                    }
                    // disabled={ticket.ErrorStatus === "Finished"}
                    fullWidth
                    sx={{
                      ...btnStyle,
                      ...(ticket.ErrorStatus === "Finished" && {
                        border: "3px solid #f1faee",
                        boxShadow: "2px 2px 5px grey",
                      }),
                    }}
                    onClick={() => handleCloseErrorClick(ticket)}
                  >
                    <BiShare size={20} />
                    טופל
                  </Button>
                </div>
                <hr width="90%" color="#f5f5f5" />
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MyTickets;
