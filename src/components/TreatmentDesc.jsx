import { Typography } from "@mui/material";
import formatDate from "../util/formatDate";
import formatDateTime from "../util/formatDarteTime";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const TreatmentDesc = (props) => {
  const { user } = useSelector(selectUser);
  // console.log(props);
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 15px",
    gap: "0px",
    backgroundColor: "#d8f1fc",
    border: "1px solid #b2b5b5",
  };
  const rowStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: "0px",
  };
  const itemStyles = {
    color: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 5px",
    width: "100%",
    height: "2.5em",
    border: "1px solid #b2b5b5",
    textAlign: "center",
  };
  return (
    <div style={containerStyles}>
      {props.props.map((item, i) => (
        <div key={i + item?.Time} style={rowStyles}>
          <Typography variant="body2" sx={itemStyles}>
            {formatDateTime(item?.Time)}
          </Typography>
          <Typography variant="body2" sx={itemStyles}>
            {item?.TechnicianName ? item?.TechnicianName : user?.Name}
          </Typography>
          <Typography variant="body2" sx={itemStyles}>
            {item?.StatusDescription ? item?.StatusDescription : "פתיחת תקלה"}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default TreatmentDesc;
