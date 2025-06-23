// components/ThemeToggle.jsx
import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // moon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // sun

export default function ThemeToggle({ mode, toggleTheme }) {
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
