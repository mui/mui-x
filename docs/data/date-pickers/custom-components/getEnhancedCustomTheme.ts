'use client';
import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

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

type PaletteMode = 'light' | 'dark';

export const getEnhancedCustomTheme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,

    primary: {
      light: 'hsl(240, 83%, 88%)',
      main: 'hsl(240, 83%, 65%)',
      dark: 'hsl(240, 78%, 43%)',
      contrastText: '#fff',
      ...(mode === 'dark' && {
        contrastText: 'hsl(240, 82%, 97%)',
        light: 'hsl(240, 83%, 80%)',
        main: 'hsl(240, 83%, 70%)',
        dark: 'hsl(240, 78%, 35%)',
      }),
    },
  },
  typography: {
    fontFamily: ['"Inter", "sans-serif"'].join(','),
    fontSize: 13,
  },
  components: {
    MuiEnhancedDateRangePickerDay: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
        insidePreviewing: {
          // the ::after pseudo element is used to create the previewing effect on hover
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
          },
        },
        previewStart: {
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
          },
        },
        previewEnd: {
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
          },
        },

        startOfWeek: {
          '::before': {
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
          },
        },
        endOfWeek: {
          '::before': {
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
          },
        },
      },
    },
  },
});
