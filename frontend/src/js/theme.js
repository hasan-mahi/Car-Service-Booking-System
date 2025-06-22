export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#007bff' },
        }
      : {
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
});
