import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton,
  Avatar, Menu, MenuItem, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import { useTheme, useScrollTrigger } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";
import useScrollDirection from "../../js/useScrollDirection";

const pages = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Bookings", path: "/bookings" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar({ toggleTheme }) {
  const theme = useTheme();
  const scrollDir = useScrollDirection({ threshold: 20, hideDelay: 200 });
  const isScrolled = useScrollTrigger({ threshold: 5 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = { name: "John Doe" };
  const isLoggedIn = true;

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const themeColors = theme.palette.mode === "light"
    ? {
        bgGradient: "linear-gradient(90deg, #4a6fa5, #2a3f5e)",
        textPrimary: "#f5f7fa",
        accent: "#FF6F00",
        avatarBg: "#D9D9D9",
        avatarText: "#1E2A38",
        buttonHoverBg: "rgba(255,111,0,0.25)",
        drawerBg: "#F0F4F8",
        drawerText: "#1E2A38",
        textShadow: "0 0 3px rgba(0,0,0,0.5)",
      }
    : {
        bgGradient: "linear-gradient(90deg, #2f2f2f, #1b1b1b)",
        textPrimary: "#E0E0E0",
        accent: "#FFAB40",
        avatarBg: "#444444",
        avatarText: "#FFAB40",
        buttonHoverBg: "rgba(255,171,64,0.15)",
        drawerBg: "#121212",
        drawerText: "#E0E0E0",
        textShadow: "none",
      };

  return (
    <>
<motion.div
  initial={{ y: 0, opacity: 1 }}
  animate={{
    y: scrollDir === "down" ? -100 : 0,
    opacity: scrollDir === "down" ? 0 : 1,
  }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
        <AppBar
          position="sticky"
          sx={{
            background: themeColors.bgGradient,
            boxShadow: isScrolled ? 3 : 0,
            backdropFilter: isScrolled ? "blur(8px)" : "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo & Title */}
            <motion.div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <CarRepairIcon sx={{ fontSize: 28, color: themeColors.accent }} />
              </motion.div>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: themeColors.textPrimary, textShadow: themeColors.textShadow }}
              >
                CarService
              </Typography>
            </motion.div>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <NavLinks pages={pages} themeColors={themeColors} />
              <ThemeToggle toggleTheme={toggleTheme} />
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: themeColors.avatarBg, color: themeColors.avatarText }}>
                  {user.name[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: themeColors.drawerBg,
                    color: themeColors.drawerText,
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
              </Menu>
            </Box>

            {/* Mobile Menu Button + Theme Toggle */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
              <ThemeToggle toggleTheme={toggleTheme} />
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: themeColors.accent }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pages={pages}
        themeColors={themeColors}
        isLoggedIn={isLoggedIn}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
