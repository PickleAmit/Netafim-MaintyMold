import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "../App";
import { useSelector } from "react-redux";

const ThemeWrapper = () => {
  const mode = useSelector((state) => state.user.mode);
  const theme = createTheme({
    palette: {
      mode: `${mode}`,
      // text: {
      //   // primary: "#49d373",
      //   // secondary: "#000",

      // },
      primary: {
        main: "#353750",
      },
      background: {
        paper: "#383a54",
      },
      //           action:{
      // disabled: "#d0c94b",
      // disabledBackground: "#2fd63a"
      //           }
    },
    direction: "rtl",
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};
export default ThemeWrapper;
