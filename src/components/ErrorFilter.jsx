import { Box, TextField } from "@mui/material";

const ErrorFilter = ({ filterErrors }) => {
  const handleFilterInputChange = (event) => {
    const filterValue = event.target.value;
    filterErrors(filterValue);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <TextField
        label="סינון תקלות"
        variant="outlined"
        size="small"
        dir="rtl"
        margin="dense"
        onChange={handleFilterInputChange}

      // sx={{
      //   backgroundColor: "#e8f0fe",
      // }}
      />
    </Box>
  );
};

export default ErrorFilter;
