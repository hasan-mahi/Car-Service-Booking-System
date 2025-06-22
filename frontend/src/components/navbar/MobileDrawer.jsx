import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Login,
  Logout,
  Settings,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function MobileDrawer({
  open,
  onClose,
  pages,
  themeColors,
  isLoggedIn,
}) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev);
  };

  // Close drawer only when clicking actual navigation links
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: themeColors.drawerBg,
          color: themeColors.drawerText,
        },
      }}
    >
      {/* Remove onClick={onClose} here to prevent auto closing on any click */}
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {pages.map((page) => {
            const isActive = location.pathname === page.path;
            return (
              <ListItemButton
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleLinkClick} // close drawer on click
                sx={{
                  color: isActive ? themeColors.accent : "inherit",
                  backgroundColor: isActive
                    ? themeColors.buttonHoverBg
                    : "transparent",
                  position: "relative",
                  "&::after": isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 4,
                        left: 16,
                        width: "60%",
                        height: 2,
                        backgroundColor: themeColors.accent,
                        borderRadius: 1,
                        transition: "width 0.3s ease",
                      }
                    : {},
                }}
              >
                <ListItemText primary={page.name} />
              </ListItemButton>
            );
          })}

          <Divider sx={{ my: 1 }} />

          {!isLoggedIn ? (
            <ListItemButton
              component={Link}
              to="/login"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <Login sx={{ color: themeColors.accent }} />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          ) : (
            <>
              {/* Clicking Account toggles dropdown but does NOT close drawer */}
              <ListItemButton onClick={handleProfileToggle}>
                <ListItemIcon>
                  <AccountCircle sx={{ color: themeColors.accent }} />
                </ListItemIcon>
                <ListItemText primary="Account" />
                {profileOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={profileOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Close drawer only on actual navigation clicks */}
                  <ListItemButton
                    component={Link}
                    to="/profile"
                    sx={{ pl: 4 }}
                    onClick={handleLinkClick}
                  >
                    <ListItemIcon>
                      <Settings sx={{ color: themeColors.accent }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }} onClick={handleLinkClick}>
                    <ListItemIcon>
                      <Logout sx={{ color: themeColors.accent }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
