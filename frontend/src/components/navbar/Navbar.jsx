import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import { motion } from "framer-motion";
import useScrollDirection from "../../js/useScrollDirection";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";
import MobileDrawer from "./MobileDrawer";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const pages = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Bookings", path: "/bookings" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Contact", path: "/contact" },
];

function getUserInitials(name) {
  if (!name) return "U";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
}

export default function Navbar({ mode, toggleTheme, user = null, onLogout }) {
  const theme = useTheme();
  const scrollDir = useScrollDirection({ threshold: 20, hideDelay: 200 });
  const isScrolled = useScrollTrigger({ threshold: 5 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const themeColors =
    theme.palette.mode === "light"
      ? {
          bgGradient: "linear-gradient(90deg, #4a6fa5, #2a3f5e)",
          textPrimary: "#f5f7fa",
          accent: "#FF6F00",
          avatarBg: "#D9D9D9",
          avatarText: "#1E2A38",
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
          drawerBg: "#121212",
          drawerText: "#E0E0E0",
          textShadow: "none",
        };

  const navbarHeight = 64;

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  return (
    <>
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: scrollDir === "down" ? -navbarHeight : 0,
          opacity: scrollDir === "down" ? 0.6 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: navbarHeight,
          zIndex: 1100,
          backgroundColor:
            scrollDir === "down"
              ? "rgba(30, 30, 30, 0.4)"
              : "transparent",
          backdropFilter: scrollDir === "down" ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrollDir === "down" ? "blur(10px)" : "none",
          pointerEvents: scrollDir === "down" ? "none" : "auto",
        }}
      >
        <AppBar
          position="static"
          sx={{
            background:
              scrollDir === "down"
                ? "rgba(30, 30, 30, 0.4)"
                : themeColors.bgGradient,
            boxShadow: isScrolled ? 3 : 0,
            height: "100%",
            justifyContent: "center",
            transition: "background 0.3s ease-in-out",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              minHeight: navbarHeight,
              px: { xs: 2, md: 3 },
            }}
          >
            <motion.div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                userSelect: "none",
              }}
              aria-label="Go to homepage"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
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
                sx={{
                  color: themeColors.textPrimary,
                  textShadow: themeColors.textShadow,
                }}
              >
                CarService
              </Typography>
            </motion.div>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <NavLinks pages={pages} themeColors={themeColors} />
              <ThemeToggle mode={mode} toggleTheme={toggleTheme} />

              {!user ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/auth"
                    variant="outlined"
                    sx={{ color: themeColors.textPrimary, borderColor: themeColors.textPrimary }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/auth?mode=register"
                    variant="contained"
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    aria-controls={Boolean(anchorEl) ? "user-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                    aria-label="User menu"
                  >
                    <Avatar
                      sx={{ bgcolor: themeColors.avatarBg, color: themeColors.avatarText }}
                      alt={user.name || user.username || "U"}
                    >
                      {getUserInitials(user.name || user.username || "User")}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="user-menu"
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
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    {user.role === "admin" && (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/admin");
                        }}
                      >
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
              <ThemeToggle mode={mode} toggleTheme={toggleTheme} />
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: themeColors.accent }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pages={pages}
        themeColors={themeColors}
        isLoggedIn={Boolean(user)}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
