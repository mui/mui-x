import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ThemeOptionsContext } from '@mui/internal-core-docs/ThemeContext';

// eslint-disable-next-line react/prop-types
export function ExperimentLayout({ children, fullScreen = false }) {
  const { paletteMode, direction } = React.useContext(ThemeOptionsContext);
  const theme = React.useMemo(
    () => createTheme({ palette: { mode: paletteMode }, direction }),
    [paletteMode, direction],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={fullScreen ? { display: 'flex', height: '100dvh', p: 1.5 } : undefined}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
