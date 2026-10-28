
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import { store } from "./app/store";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#635BFF",
    },
    background: {
      default: "#F5F6FA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
