import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useToastPopup, ToasterPopup } from "../components/ToasterPopup";
import { getErrorById, updateErrorDetails } from "../features/errorsSlice";
import { selectUser } from "../features/userSlice";
import "./ticketDetails.css";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
} from "@mui/material";
import SingleItem from "../components/SingleItem";
import formatDate from "../util/formatDate";

import TreatmentDesc from "../components/TreatmentDesc";
import BtnTicketFooter from "../components/BtnTicketFooter";
import getUrl from "../app/baseUrl";

const URL = getUrl();

const priorityMap = {
  Red: "High",
  Yellow: "Med",
  Green: "Low",
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
};

const technicianMap = {
  2: "עמית שנער",
  4: "דין דויד",
  6: "יניב זיתוני",
  1002: "פלוני אלמוני",
};

const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const errorDetails = useSelector((state) => state.errors.specificError);
  const [showPopup, setShowPopup] = useState(false);
  const mode = useSelector((state) => state.user.mode);
  const [selectedPriority, setSelectedPriority] = useState(
    priorityMap[errorDetails?.Error?.PriorityName] || ""
  );
  const [selectedTechnician, setSelectedTechnician] = useState(
    errorDetails?.Error?.LeadingTechnician || ""
  );
  const [showModal, setShowModal] = useState(false);
  const [predictedTechnician, setPredictedTechnician] = useState(null);

  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToastPopup();

  const problems = [
    "תקלה ראשונה",
    "בעיה חמורה מאוד",
    "נקרעה רצועה V52",
    "נזילה בתבנית",
    "תקלת חדירת שמן",
    "תקלה בשסתום הוויפיי",
    "תקלת סגר דריפנט",
  ];
  const makePrediction = () => {
    if (selectedPriority === "") {
      showErrorToast("נא לבחור עדיפות");
      return;
    }
    const data = {
      ProblemType: problems[Math.floor(Math.random() * problems.length)],
      Priority:
        selectedPriority == "Green" ? 1 : selectedPriority == "Yellow" ? 2 : 3,
    };

    // https://proj.ruppin.ac.il/cgroup91/prod/dist/PythonML/predict
    console.log(
      `Priority - ${selectedPriority}, ProblemType - ${data.ProblemType}`
    );
    fetch(`http://127.0.0.1:5000/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPredictedTechnician(data.technician);
        setShowModal(true);
      })
      .then(() => {
        showSuccessToast("המלצה בוצעה בהצלחה");
      })
      .catch((error) => {
        console.error("Error:", error);
        showErrorToast("תקלה בביצוע המלצה");
      });
  };

  useEffect(() => {
    dispatch(getErrorById(id));
  }, []);

  const getBackgroundColor = (priorityName) => {
    if (errorDetails?.Error?.ClosingDate) return;
    switch (priorityName) {
      case "Red":
        return { redBG: true };
      case "Yellow":
        return { yellowBG: true };
      case "Green":
        return { greenBG: true };
      default:
        return {};
    }
  };

  //function that toggles the popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // const handleOpenModal = () => {
  //   if (selectedPriority === "") {
  //     showErrorToast("נא לבחור עדיפות");
  //   } else {
  //     setShowModal(true);
  //   }
  // };

  if (errorDetails) {
    return (
      <div className="ticket_detalis_container">
        <div className="ticket_detalis_header">
          <Typography variant="h5" color={"black"}>
            תקלה מס' <strong> {errorDetails?.Error?.ErrorNumber}</strong>
          </Typography>
        </div>
        <div className="ticket_detalis_sections">
          <div className="ticket_detalis_sectionA">
            <Typography variant="body1" color={"black"}>
              תיאור תבנית
            </Typography>
          </div>
          <div className="ticket_detalis_sectionB">
            <Typography variant="body1" color={"black"}>
              {errorDetails?.Error?.MoldDescription}
            </Typography>
          </div>
          <div className="ticket_detalis_sectionC">
            <div className="ticket_detalis_sectionC_child">
              <SingleItem
                title={"פותח התקלה"}
                value={errorDetails?.Error?.OpenTechnicianName}
              />
              <SingleItem
                title={"תאריך הפתיחה"}
                value={formatDate(errorDetails?.Error?.OpeningDate)}
              />
              {errorDetails?.Error?.ClosingDate && (
                <SingleItem
                  title={"תאריך סגירה"}
                  value={
                    errorDetails?.Error?.ClosingDate
                      ? formatDate(errorDetails?.Error?.ClosingDate)
                      : "-"
                  }
                />
              )}
              <SingleItem
                title={"טכנאי מוביל"}
                value={selectedTechnician ? selectedTechnician : "-"}
                selectOptions={
                  user?.AreaOfExpertise === "Manager"
                    ? [
                        { value: "2", label: "עמית" },
                        { value: "4", label: "דין דויד" },
                        { value: "6", label: "יניב" },
                        { value: "1002", label: "פלוני" },
                      ]
                    : null
                }
                onSelectChange={(event) => {
                  setSelectedTechnician(event.target.value);
                }}
              />
            </div>
            <div className="ticket_detalis_sectionC_child">
              <SingleItem
                title={"עדיפות"}
                value={selectedPriority ? selectedPriority : "-"}
                width={"60px"}
                {...getBackgroundColor(errorDetails?.Error?.PriorityName)}
                selectOptions={
                  user?.AreaOfExpertise === "Manager"
                    ? [
                        { value: "Red", label: "High" },
                        { value: "Yellow", label: "Medium" },
                        { value: "Green", label: "Low" },
                      ]
                    : null
                }
                onSelectChange={(event) => {
                  setSelectedPriority(event.target.value);
                  // console.log(event.target.value);
                }}
              />
              <SingleItem
                title={"קטגוריה"}
                value={errorDetails?.Error?.ErrorType}
                width={"60px"}
              />
              <SingleItem
                title={"מצב"}
                value={errorDetails?.Error?.ClosingDate ? "טופל" : "בטיפול"}
                width={"60px"}
                greenBG={errorDetails?.Error?.ClosingDate ? true : false}
              />
              <SingleItem
                title={"קבצים מצורפים"}
                value={errorDetails?.Error?.ErrorPicture ? "1" : "0"}
                width={"60px"}
                onClick={
                  errorDetails?.Error?.ErrorPicture ? togglePopup : undefined
                }
              />
              {errorDetails?.Error?.ErrorPicture && (
                <Button variant="contained" size="small" onClick={togglePopup}>
                  הצג תמונה
                </Button>
              )}
              <React.Fragment key={showPopup}>
                <Dialog open={showPopup} onClose={togglePopup}>
                  <DialogContent>
                    {errorDetails?.Error?.ErrorPicture && (
                      <img
                        src={`data:image/png;base64,${errorDetails?.Error?.ErrorPicture}`}
                        alt="Error Picture"
                        style={imageStyle}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            </div>
          </div>
        </div>
        <div className="ticket_detalis_2nd_sections">
          <div className="ticket_detalis_2nd_sections_child">
            <Typography
              variant="body1"
              // color={mode === "dark" ? "white" : "black"}
            >
              מיקום
            </Typography>
            <div className="ticket_detalis_2nd_sections_child_box">
              <Typography variant="body2" color={"black"}>
                {errorDetails?.Error?.MoldLocation}
              </Typography>
            </div>
          </div>

          <div className="ticket_detalis_2nd_sections_child">
            <Typography
              variant="body1"
              // color={mode === "dark" ? "white" : "black"}
            >
              תיאור תקלה
            </Typography>
            <div className="ticket_detalis_2nd_sections_child_box">
              <Typography variant="body2" color={"black"}>
                {errorDetails?.Error?.ErrorDescription}
              </Typography>
            </div>
          </div>
        </div>

        <Typography
          variant="subtitle1"
          sx={{
            textAlign: "end",
            margin: "0 20px",
          }}
          // color={mode === "dark" ? "white" : "black"}
        >
          תיאור טיפול
        </Typography>
        {errorDetails?.StatusErrors && (
          <TreatmentDesc props={errorDetails?.StatusErrors} />
        )}
        {user?.AreaOfExpertise === "Manager" && (
          <div className="BtnTicketFooter">
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ marginRight: "10px" }}
              onClick={() => {
                dispatch(
                  updateErrorDetails({
                    errorNumber: errorDetails?.Error?.ErrorNumber,
                    description: selectedPriority,
                    leadingTechnicianId: selectedTechnician,
                  })
                )
                  .then(() => {
                    navigate("/tickets/manager");
                    showSuccessToast("עודכנה התקלה בהצלחה!");
                  })
                  .catch(() => {
                    showErrorToast("תקלה בביצוע העדכון");
                  });
              }}
            >
              אישור
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{ marginRight: "10px" }}
              onClick={makePrediction}
            >
              טכנאי מומלץ
            </Button>
          </div>
        )}
        {user?.AreaOfExpertise === "MoldRoomTechnician" &&
          errorDetails?.Error?.ClosingDate === null && <BtnTicketFooter />}
        {showModal && (
          <Dialog
            sx={{ direction: "ltr" }}
            open={showModal}
            onClose={() => setShowModal(false)}
            PaperProps={{
              style: {
                borderColor: mode === "dark" ? "black" : "white",
                borderWidth: "2px",
                borderStyle: "solid",
              },
            }}
          >
            <DialogTitle sx={{ textAlign: "center", color: "white" }}>
              טכנאי מומלץ
            </DialogTitle>
            <DialogContent sx={{ color: "white" }}>
              הטכנאי המומלץ לתקלה זו : {technicianMap[predictedTechnician]}
            </DialogContent>
            <Button onClick={() => setShowModal(false)} sx={{ color: "white" }}>
              סגור
            </Button>
          </Dialog>
        )}
        <ToasterPopup />
      </div>
    );
  }
  return <div />;
};

export default TicketDetails;
