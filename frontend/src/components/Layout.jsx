import React from "react";
import { useTheme } from "@mui/material";

const Layout = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        paddingTop: 64, // default navbar height for desktop
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        boxSizing: "border-box",
        transition: "padding-top 0.3s ease",
      }}
      className="app-layout"
    >
      {children}
      <style>
        {`
          /* Responsive navbar height padding */
          @media (max-width: 600px) {
            .app-layout {
              padding-top: 56px; /* navbar height on mobile */
            }
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
