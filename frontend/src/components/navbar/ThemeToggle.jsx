import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ThemeToggle({ toggleTheme }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
