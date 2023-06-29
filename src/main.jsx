import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

// import { createTheme, ThemeProvider } from "@mui/material/styles";

import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
// import { CssBaseline } from "@mui/material";
import ThemeWrapper from "./components/ThemeWrapper";

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#353750",
//     },
//   },
//   direction: "rtl",
// });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <CacheProvider value={cacheRtl}>
    {/* <ThemeProvider theme={theme}> */}
      <Provider store={store}>
        <BrowserRouter basename="/cgroup91/prod/dist/">
        {/* <CssBaseline /> */}
          {/* <App /> */}
          <ThemeWrapper/>
        </BrowserRouter>
      </Provider>
     {/* </ThemeProvider> */}
  </CacheProvider>
);
