import { TextField, Typography, Button, Menu } from "@mui/material";
import Box from "@mui/material/Box";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import {
  setNewError,
  getMoldInfo,
  updateMoldStatusAfterTreatment,
} from "../features/errorsSlice";
import { selectUser } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToasterPopup, useToastPopup } from "../components/ToasterPopup";

const NewTicket = () => {
  const [newErrorState, setNewErrorState] = useState({
    moldNumber: "",
    category: "",
    moldLocation: "",
    errorDesc: "",
    errorPicture: null,
  });

  const molds = useSelector((state) => state.errors.molds);
  const { showErrorToast } = useToastPopup();
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.user.mode);

  useEffect(() => {
    dispatch(getMoldInfo());
  }, []);

  const selectedMold = molds.find(
    (mold) => mold.MoldId === newErrorState.moldNumber
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewErrorState((prevState) => ({
          ...prevState,
          errorPicture: e.target.result, // Set the base64 string as the errorPicture
        }));
      };
      reader.readAsDataURL(file); // Read the file as a data URL (base64 string)
    }
  };
  const handleNewError = () => {
    if (!newErrorState.errorDesc || newErrorState.errorDesc.trim() === "") {
      showErrorToast("נא להזין תיאור תקלה");
      return;
    }

    if (!newErrorState.category) {
      showErrorToast("נא לבחור קטגוריה");
      return;
    }

    const errorData = {
      Description: newErrorState.errorDesc,
      Type: newErrorState.category,
      TechnicianID: user.EmployeeID,
      MoldID: newErrorState.moldNumber,
      ErrorPicture: newErrorState.errorPicture,
    };
    dispatch(
      updateMoldStatusAfterTreatment({
        moldId: newErrorState.moldNumber,
        MoldStatusAfterTreatment: "ממתין לטיפול",
      })
    );
    dispatch(setNewError(errorData)).then((resultAction) => {
      const errorNumber = resultAction.payload.ErrorNumber;
      navigate(`/tickets/${errorNumber}`);
    });
  };

  return (
    <div className="ticket_detalis_container">
      <div className="ticket_detalis_header">
        <ToasterPopup />
        <Typography variant="h5" sx={{ padding: "5px", color: "black" }}>
          יצירת תקלה חדשה
        </Typography>
      </div>
      <div className="new_ticket_section">
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              בחר תבנית
            </Typography>
          </div>
          <div className="new_ticket_section_child_b">
            <FormControl fullWidth>
              <InputLabel id="mold_select" sx={{ color: "black" }}>
                מספר תבנית
              </InputLabel>
              <Select
                sx={{ bgcolor: "grey.300", color: "black" }}
                labelId="mold_select"
                name="selectMold"
                id="molds"
                className="molds_select"
                label="מספר תבנית"
                value={newErrorState.moldNumber}
                onChange={(e) => {
                  setNewErrorState((prevState) => ({
                    ...prevState,
                    moldNumber: e.target.value,
                  }));
                }}
              >
                {molds.length > 0 &&
                  molds.map((mold) => (
                    <MenuItem
                      key={mold.MoldId}
                      value={mold.MoldId}
                      sx={{ color: "white" }}
                      dir="rtl"
                    >
                      {mold.MoldId}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              {" "}
              תיאור התבנית
            </Typography>
          </div>
          <div className="new_ticket_section_child_b">
            <TextField
              disabled
              multiline
              rows={3}
              fullWidth
              dir="rtl"
              id="moldDesc"
              label="תיאור"
              variant="filled"
              value={selectedMold ? selectedMold.MoldDesc : ""}
              sx={{ bgcolor: mode == "light" ? "white" : "black" }}
            />
          </div>
        </div>
      </div>
      <div className="new_ticket_section">
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              קטגוריה
            </Typography>
          </div>
          <div className="new_ticket_section_child_b">
            <FormControl fullWidth>
              <InputLabel id="mold_select" sx={{ color: "#8487af" }}>
                בחר קטגוריה
              </InputLabel>
              <Select
                labelId="category_select"
                name="selectCategory"
                id="category"
                className="mategory_select"
                label="Age"
                value={newErrorState.category}
                sx={{ bgcolor: mode == "light" ? "white" : "black" }}
                onChange={(e) => {
                  setNewErrorState((prevState) => ({
                    ...prevState,
                    category: e.target.value,
                  }));
                }}
              >
                <MenuItem value="שבר" dir="rtl" sx={{ color: "white" }}>
                  שבר
                </MenuItem>
                <MenuItem value="יזום" dir="rtl" sx={{ color: "white" }}>
                  יזום
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {/* <div className="new_ticket_section"> */}
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              צרף קבצים
            </Typography>
          </div>
          <div className="new_ticket_section_child_b_uploadIcon">
            <input
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              id="upload-photo"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-photo">
              <UploadFileIcon style={{ cursor: "pointer", color: "black" }} />
            </label>
          </div>
        </div>
      </div>
      <div className="new_ticket_section">
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              מיקום תבנית
            </Typography>
          </div>
          <div className="new_ticket_section_child_b">
            <TextField
              fullWidth
              disabled
              dir="rtl"
              id="moldLocation"
              label="מיקום תבנית"
              variant="filled"
              sx={{ bgcolor: mode == "light" ? "white" : "black" }}
              value={selectedMold ? selectedMold.MoldLocation : ""}
            />
          </div>
        </div>
        <div className="new_ticket_section_row">
          <div className="new_ticket_section_child_a">
            <Typography variant="body1" color="black">
              תיאור תקלה
            </Typography>
          </div>
          <div className="new_ticket_section_child_b">
            <TextField
              required
              multiline
              dir="rtl"
              rows={3}
              fullWidth
              id="newDesc"
              label="הכנס תיאור"
              variant="outlined"
              sx={{ bgcolor: mode == "light" ? "white" : "black" }}
              onChange={(e) => {
                setNewErrorState((prevState) => ({
                  ...prevState,
                  errorDesc: e.target.value,
                }));
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          size="medium"
          sx={{
            width: "50%",
            marginBottom: "10px",
          }}
          onClick={handleNewError}
        >
          אישור
        </Button>
      </div>
    </div>
  );
};

export default NewTicket;
