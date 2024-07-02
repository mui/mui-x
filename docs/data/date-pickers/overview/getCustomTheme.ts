'use client';
import { alpha, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const brand = {
  50: 'hsl(240, 82%, 97%)',
  100: 'hsl(240, 83%, 93%)',
  200: 'hsl(240, 83%, 88%)',
  300: 'hsl(240, 83%, 80%)',
  400: 'hsl(240, 83%, 70%)',
  500: 'hsl(240, 83%, 65%)',
  600: 'hsl(240, 78%, 55%)',
  700: 'hsl(240, 78%, 43%)',
  800: 'hsl(240, 78%, 35%)',
  900: 'hsl(240, 78%, 20%)',
};

export const gray = {
  50: 'hsl(220, 60%, 99%)',
  100: 'hsl(220, 35%, 94%)',
  200: 'hsl(220, 35%, 88%)',
  300: 'hsl(220, 25%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 25%, 35%)',
  700: 'hsl(220, 25%, 25%)',
  800: 'hsl(220, 25%, 10%)',
  900: 'hsl(220, 30%, 5%)',
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    background: {
      default: '#FBFCFE',
      paper: '#FFFFFF',
      ...(mode === 'dark' && {
        default: alpha(gray[800], 0.95),
        paper: gray[900],
      }),
    },
    primary: {
      light: brand[200],
      main: brand[500],
      dark: brand[700],
      contrastText: '#fff',
      ...(mode === 'dark' && {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[800],
      }),
    },
  },
});

export const getCustomTheme = (mode: PaletteMode) => {
  const tokens = getDesignTokens(mode);

  return {
    ...tokens,
    typography: { fontFamily: 'Inter' },
  };
};

const theme = createTheme(getCustomTheme('light'));

export default theme;
