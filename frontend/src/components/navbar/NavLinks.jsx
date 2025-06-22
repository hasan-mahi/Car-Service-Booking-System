import React from "react";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function NavLinks({ pages, themeColors }) {
  const location = useLocation();

  return pages.map((page) => {
    const isActive = location.pathname === page.path;

    return (
      <motion.div
        key={page.name}
        style={{ position: "relative", display: "inline-block" }}
      >
        <Button
          component={Link}
          to={page.path}
          aria-current={isActive ? "page" : undefined}
          sx={{
            color: themeColors.textPrimary,
            fontWeight: 600,
            textTransform: "none",
            textShadow: themeColors.textShadow,
            '&:hover, &:focus': {
              backgroundColor: themeColors.buttonHoverBg,
              color: themeColors.accent,
              outline: "none",
            },
          }}
        >
          {page.name}
        </Button>

        {isActive && (
          <motion.div
            layoutId="underline"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              width: "100%",
              backgroundColor: themeColors.accent,
              borderRadius: 2,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    );
  });
}

export default NavLinks;
