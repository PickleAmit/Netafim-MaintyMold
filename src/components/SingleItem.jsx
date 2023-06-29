import { Typography } from "@mui/material";

const SingleItem = ({
  title = "",
  value = "",
  width = "100px",
  greenBG = false,
  yellowBG = false,
  redBG = false,
  selectOptions = null,
  onSelectChange = null,
  onOpen = null, // add the onOpen function here
}) => {
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const titleStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  };
  const valueStyles = {
    borderRadius: "10px",
    backgroundColor: greenBG
      ? "#37ed5d"
      : yellowBG
      ? "#ed9a3c"
      : redBG
      ? "#f00605"
      : "#efefef",
    border: "1px solid #b2b5b5",
    padding: "0 10px ",
    width,
    display: "flex",
    justifyContent: "center",
  };
  const selectStyle = {
    borderRadius: "20%",
    backgroundColor: "#efefef",
    border: "1px solid #b2b5b5",
    width: "inherit",
  };
  const handleClick = () => {
    if (onOpen) onOpen();
  };

  const renderValue = () => {
    if (selectOptions) {
      return (
        <select
          style={selectStyle}
          value={value}
          onChange={onSelectChange}
          onClick={handleClick}
        >
          <option value="">בחר</option>
          {selectOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <Typography variant="body1" color="black">
          {value}
        </Typography>
      );
    }
  };

  return (
    <div style={containerStyles}>
      <div style={titleStyles}>
        <Typography variant="body1" color="black">
          {title}
        </Typography>
      </div>
      <div style={valueStyles}>{renderValue()}</div>
    </div>
  );
};

export default SingleItem;
