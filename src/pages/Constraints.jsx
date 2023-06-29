import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Switch,
  Badge,
  Divider,
  IconButton,
} from "@mui/material";
import {
  DateCalendar,
  MobileTimePicker,
  PickersDay,
} from "@mui/x-date-pickers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ToasterPopup, useToastPopup } from "../components/ToasterPopup";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import BottomModal from "../components/BottomModal";
import { useDispatch, useSelector } from "react-redux";
import { closeBottomModal, openBottomModal } from "../features/modalSlice";
import { selectUser } from "../features/userSlice";
import {
  getConstraintsByTechnician,
  selectConstraints,
  setNewConstraint,
} from "../features/constraintsSlice";

import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

//ltr + added more code in /components/index.css
const cacheLtr = createCache({
  key: "muiltr",
  stylisPlugins: [prefixer],
});

const muiWhiteColor = {
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiFormLabel-root": {
    color: "white",
  },
};

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "100%",
  padding: "2rem",
  boxSizing: "border-box",
  backgroundColor: "background.paper",
  boxShadow: 24,
  gap: "1rem",
  overflow: "scroll",
};

function CustomDay(props) {
  const {
    constraints = [],
    day,
    outsideCurrentMonth,
    isInCurrentOrLaterMonth,
    ...other
  } = props;
  const isSelected = constraints.some(
    (constraint) =>
      !props.outsideCurrentMonth &&
      dayjs(constraint.ConstraintDate).isSame(dayjs(props.day), "day") &&
      isInCurrentOrLaterMonth(dayjs(constraint.ConstraintDate))
  );

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🔴" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

const Constraints = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const userConstraints = useSelector(selectConstraints);
  const mode = useSelector((state) => state.user.mode);

  const technicianID = user.EmployeeID;
  const [value, setValue] = useState(dayjs());
  // Toast popup
  const { showErrorToast, showSuccessToast } = useToastPopup();

  // The data that we send to setNewConstraint
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    dispatch(getConstraintsByTechnician(technicianID));
  }, []);
  const handleOpen = () => {
    dispatch(openBottomModal());
  };

  const handleClose = () => {
    dispatch(closeBottomModal());
  };
  // Checks if the date is in the current month or the coming months
  const isInCurrentOrLaterMonth = (date) => {
    const currentDate = dayjs();
    return (
      dayjs(date).isSame(currentDate, "month") ||
      dayjs(date).isAfter(currentDate, "month")
    );
  };

  const handleAllDayChange = (isChecked) => {
    setAllDay(isChecked);
    if (isChecked) {
      setStartTime(dayjs("08:00:00", "HH:mm:ss"));
      setEndTime(dayjs("19:00:00", "HH:mm:ss"));
    } else {
      setStartTime(dayjs());
      setEndTime(dayjs());
    }
  };

  const handleNewConstraint = async () => {
    try {
      const constraintDate = value.format("YYYY-MM-DD");
      const constraintStartHour = startTime.format("HH:mm");
      const constraintEndHour = endTime.format("HH:mm");

      if (!description || !constraintStartHour || !constraintEndHour) {
        showErrorToast("לא כל השדות מולאו");
        return;
      }

      await dispatch(
        setNewConstraint({
          technicianID,
          description,
          constraintDate,
          constraintStartHour,
          constraintEndHour,
        })
      );
      showSuccessToast("התווסף בהצלחה");
      handleClose();
      setDescription("");
      setStartTime(dayjs());
      setEndTime(dayjs());
      setAllDay(false);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <div>
      <div className="constraints_header">
        <Typography variant="h6" sx={{ color: "black" }}>
          אילוצים שלי
        </Typography>
      </div>
      <ToasterPopup />
      <Box sx={{ margin: "1rem 0" }}>
        <CacheProvider value={cacheLtr}>
          <DateCalendar
            label="controlled calendar"
            views={["day"]}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{
              border: "1px solid #353750",
              borderRadius: "10px",
              // color: "#49d373"
            }}
            slots={{
              day: CustomDay,
            }}
            slotProps={{
              day: {
                constraints: userConstraints,
                isInCurrentOrLaterMonth,
              },
            }}
          />
        </CacheProvider>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button variant="contained" size="medium" onClick={handleOpen}>
          הוספת אילוץ
        </Button>
      </Box>

      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>תיאור</b>
              </TableCell>
              <TableCell>
                <b>שעה</b>
              </TableCell>
              <TableCell>
                <b>תאריך</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userConstraints
              ?.filter((item) =>
                isInCurrentOrLaterMonth(dayjs(item.ConstraintDate))
              )
              .map((item, i) => (
                <TableRow key={"sy427" + i}>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell>
                    {dayjs(item.ConstraintStartHour, "HH:mm:ss").format(
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {dayjs(item.ConstraintEndHour, "HH:mm:ss").format("HH:mm")}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.ConstraintDate).format("DD-MM-YYYY")}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <BottomModal>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            // overflow: "scroll",
          }}
        >
          <Box sx={style}>
            <Button
              onClick={handleClose}
              sx={{
                alignSelf: "flex-end",
                marginBottom: "1rem",
                color: "white",
              }}
            >
              x
            </Button>
            <TextField
              fullWidth
              label="תיאור"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              dir="rtl"
              sx={muiWhiteColor}
            />
            <Divider
              light
              sx={{ margin: "1rem 0", width: "100%", borderColor: "white" }}
            ></Divider>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "1.2rem", color: "white" }}>
                : בחר שעת התחלה וסיום
              </Typography>
              <Divider
                light
                sx={{ marginTop: "1rem", width: "50%", borderColor: "white" }}
              ></Divider>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: "1rem 0",
                }}
              >
                <FormControlLabel
                  sx={{ paddingLeft: "0.5rem", color: "white" }}
                  control={
                    <Switch
                      variant="outlined"
                      color="primary"
                      checked={allDay}
                      onChange={(e) => handleAllDayChange(e.target.checked)}
                    />
                  }
                  label="כל היום"
                />
                <IconButton>
                  <AccessTimeIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginBottom: "1rem",
                }}
              >
                {/* MobileTimePicker rtl direction was made in /components/index.css */}
                <FormControl>
                  <InputLabel sx={{ color: "white" }}>סיום</InputLabel>
                  <CacheProvider value={cacheLtr}>
                    <MobileTimePicker
                      defaultValue={dayjs()}
                      label="בחר שעה"
                      direction="rtl"
                      ampm={false}
                      value={endTime}
                      onChange={(newValue) => setEndTime(newValue)}
                      sx={muiWhiteColor}
                    />
                  </CacheProvider>
                </FormControl>

                <FormControl sx={{ marginRight: "1rem" }}>
                  <InputLabel sx={{ color: "white" }}>התחלה</InputLabel>
                  <CacheProvider value={cacheLtr}>
                    <MobileTimePicker
                      defaultValue={dayjs()}
                      label="בחר שעה"
                      ampm={false}
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                      sx={muiWhiteColor}
                    />
                  </CacheProvider>
                </FormControl>
              </Box>
              <Divider variant="fullWidth" />
              <Typography sx={{ color: "white" }}>
                בתאריך - {value.format("DD-MM-YYYY")}
              </Typography>

              <Divider
                light
                sx={{ margin: "1rem", width: "50%", borderColor: "white" }}
              ></Divider>

              <Box sx={{ display: "flex", marginTop: "1rem" }}>
                <Button variant="contained" onClick={handleNewConstraint}>
                  שמור
                </Button>
                <Button
                  variant="contained"
                  sx={{ marginRight: "1rem" }}
                  onClick={handleClose}
                >
                  בטל
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </BottomModal>
    </div>
  );
};

export default Constraints;
