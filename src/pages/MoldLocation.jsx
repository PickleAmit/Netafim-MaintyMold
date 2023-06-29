import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getMoldInfo,
  updateMoldStatusAfterTreatment,
} from "../features/errorsSlice";
import {
  Button,
  Typography,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { ToasterPopup, useToastPopup } from "../components/ToasterPopup";
import Modal from "../components/Modal";
import "./moldLocation.css";
import {
  getAllLocations,
  updateMoldLocation,
  addLocation,
} from "../features/locationSlice";
import formatDate from "../util/formatDate";

const MoldLocation = () => {
  const dispatch = useDispatch();
  const molds = useSelector((state) => state.errors.molds);
  const mode = useSelector((state) => state.user.mode);

  // State for controlling the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedMold, setSelectedMold] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [moldLocationsUpdated, setMoldLocationsUpdated] = useState(false);

  const { showErrorToast, showSuccessToast } = useToastPopup();
  const locations = useSelector((state) => state.locations.items);

  const textColor = {
    color: mode === "dark" ? "white" : "black",
  };
  const handleUpdateMoldLocation = async () => {
    try {
      // First, dispatch the updateMoldLocation action
      const resultAction = await dispatch(
        updateMoldLocation({
          moldId: selectedMold.MoldId,
          locationName: selectedLocation,
        })
      );

      // Check if the updateMoldLocation action was successful
      if (updateMoldLocation.fulfilled) {
        showSuccessToast("מיקום התבנית עודכן בהצלחה");
        setMoldLocationsUpdated(true);

        let moldStatusAfterTreatment = "";
        // Determine the MoldStatusAfterTreatment based on the selected location
        if (selectedLocation === "באחסון") {
          moldStatusAfterTreatment = "באחסון";
        } else if (selectedLocation === "בטיפול") {
          moldStatusAfterTreatment = "ממתין לטיפול";
        } else {
          moldStatusAfterTreatment = "פעילה";
        }
        console.log("MoldStatus - " + moldStatusAfterTreatment);

        // Then, dispatch the updateMoldStatusAfterTreatment action
        const statusResultAction = await dispatch(
          updateMoldStatusAfterTreatment({
            moldId: selectedMold.MoldId,
            MoldStatusAfterTreatment: moldStatusAfterTreatment,
          })
        );

        // Check if the updateMoldStatusAfterTreatment action was successful
        if (updateMoldStatusAfterTreatment.fulfilled) {
          showSuccessToast("סטטוס התבנית עודכן בהצלחה");
        } else {
          showErrorToast("קרתה בעיה בעדכון סטטוס התבנית");
        }
      } else {
        showErrorToast("כשל בעדכון סטטוס תבנית");
      }
    } catch (error) {
      showErrorToast("An error occurred while updating mold location");
    }
    setShowModal(false);
    setShowPopup(false);
  };

  useEffect(() => {
    dispatch(getMoldInfo());
    dispatch(getAllLocations());
  }, [dispatch, moldLocationsUpdated]);

  // Handler for opening the modal
  const handleOpenModal = (mold) => {
    setSelectedMold(mold);
    setSelectedLocation(mold.MoldLocation);
    setShowModal(true);
  };

  const handleAddNewLocation = async () => {
    if (newLocationName) {
      try {
        const resultAction = await dispatch(addLocation(newLocationName));
        if (addLocation.fulfilled) {
          showSuccessToast("התווסף מיקום חדש בהצלחה");
        } else {
          showErrorToast("לא התווסף מיקום חדש");
        }
      } catch (error) {
        showErrorToast("קרתה תקלה בהוספת מיקום חדש");
      }
      dispatch(getAllLocations());
      setShowPopup(false);
      setNewLocationName("");
    }
  };

  const handleSetNewMoldLocation = (e) => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  return (
    <>
      <div className="myTickets_header" dir="rtl">
        <ToasterPopup />
        <Typography variant="h6" sx={{ color: "black" }}>
          מיקומי תבניות
        </Typography>
      </div>
      <div className="moldlocation_list">
        {molds.map((mold) => (
          <React.Fragment key={mold.MoldId}>
            <div className={`moldlocation_list_item`}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "10px",
                  alignSelf: "center",
                  color: "black",
                }}
              >
                {mold?.MoldDesc}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ color: "black" }}>
                  מיקום התבנית - {mold?.MoldLocation}
                </Typography>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    variant="standard"
                    disabled
                    dir="rtl"
                    value={mold?.MoldStatusAfterTreatment ?? "null"}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "black",
                        opacity: 0.5,
                      },
                      "& .MuiInput-root:before": {
                        borderColor: "black",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ marginRight: "10px", color: "black" }}
                  >
                    - סטטוס
                  </Typography>
                </div>
              </div>
            </div>

            <Button
              variant="outlined"
              onClick={() => handleOpenModal(mold)}
              sx={{
                marginLeft: "20px",
                alignSelf: "center",
                color: mode === "dark" ? "white" : "black",
                borderColor: mode === "dark" ? "white" : "black",
              }}
            >
              עדכן מיקום
            </Button>
            <div className="moldlocation_divider"></div>
          </React.Fragment>
        ))}
      </div>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        {selectedMold && (
          <div
            className={
              mode === "dark"
                ? "full_modal-content2 full_modal-content2_DarkBG"
                : "full_modal-content2"
            }
          >
            <Typography variant="body1">
              <u>תיאור תבנית</u>
            </Typography>
            <Typography variant="h5">{selectedMold.MoldDesc}</Typography>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ marginLeft: "2%" }}>
                <Typography variant="body1">טיפול אחרון</Typography>
                <TextField
                  variant="filled"
                  size="small"
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={formatDate(selectedMold?.MoldLastTreatment) ?? "null"}
                />
                <Typography variant="body1" style={{ marginTop: 10 }}>
                  סטטוס
                </Typography>
                <TextField
                  variant="filled"
                  size="small"
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedMold?.MoldStatusAfterTreatment ?? "null"}
                />
              </div>
              <div style={{ marginRight: "2%" }}>
                <Typography variant="body1">תאריך פתיחה</Typography>
                <TextField
                  variant="filled"
                  size="small"
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={formatDate(selectedMold?.ErrorOpeningDate)}
                />
                <Typography variant="body1" style={{ marginTop: 10 }}>
                  טכנאי מוביל
                </Typography>
                <TextField
                  variant="filled"
                  size="small"
                  disabled
                  style={{ marginBottom: "10px" }}
                  value={selectedMold?.LeadingTechnician}
                />
              </div>
            </div>
            <Divider
              sx={{
                margin: "15px 0px",
                marginLeft: "25%",
                width: "50%",
                borderColor: mode === "dark" ? "white" : "black",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">בחר מיקום</Typography>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120, marginLeft: "20px" }}
              >
                <InputLabel id="location-select-label">מיקום</InputLabel>
                {locations ? (
                  <Select
                    labelId="location-select-label"
                    id="location-select"
                    label="Location"
                    value={selectedLocation}
                    onChange={(event) =>
                      setSelectedLocation(event.target.value)
                    }
                  >
                    {locations.map((location) => (
                      <MenuItem
                        key={location.LocationCode}
                        value={location.LocationName}
                      >
                        {location.LocationName}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <CircularProgress />
                )}
              </FormControl>
            </div>
            <Divider sx={{ margin: "8% 0px" }} />
            <div
              style={{
                marginTop: "5%",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                sx={{ width: "50%" }}
                onClick={handleUpdateMoldLocation}
              >
                אישור
              </Button>
              <Button
                variant="contained"
                sx={{ width: "50%" }}
                onClick={handleSetNewMoldLocation}
              >
                הוספת מיקום חדש
              </Button>
            </div>
          </div>
        )}
        {showPopup && (
          <div
            className={
              mode === "dark" ? "small_popup small_popup_DarkBG" : "small_popup"
            }
          >
            <button
              className="small_popup_close"
              onClick={() => setShowPopup(false)}
            >
              X
            </button>
            <Typography variant="body1">הוספת מיקום חדש</Typography>
            <TextField
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              autoFocus
            />
            <Button
              variant="contained"
              sx={{ marginTop: "10px", width: "50%" }}
              onClick={handleAddNewLocation}
            >
              אישור
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};
export default MoldLocation;
