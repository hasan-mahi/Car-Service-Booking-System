import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from './js/theme';
import './index.css';

function Main() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App toggleTheme={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
