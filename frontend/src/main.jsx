import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./js/theme";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

function Main() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App
          mode={mode}
          toggleTheme={() =>
            setMode((prev) => (prev === "light" ? "dark" : "light"))
          }
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
