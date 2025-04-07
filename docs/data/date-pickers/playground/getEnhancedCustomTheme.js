'use client';
import { alpha } from '@mui/material/styles';

import { enhancedDateRangePickerDayClasses } from '@mui/x-date-pickers-pro/EnhancedDateRangePickerDay';

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

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    background: {
      default: gray[50],
      paper: '#FFFFFF',
      ...(mode === 'dark' && {
        default: gray[900],
        paper: '#14181F',
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
    grey: gray,
    divider: alpha(gray[300], 0.5),
    ...(mode === 'dark' && {
      divider: alpha(gray[700], 0.5),
    }),
    action: {
      activatedOpacity: 0.2,
      active: alpha(gray[500], 0.5),
      disabled: alpha(gray[500], 0.2),
      disabledBackground: alpha(gray[300], 0.12),
      focus: alpha(gray[500], 0.12),
      hover: alpha(gray[400], 0.08),
      hoverOpacity: 0.08,
      selected: alpha(gray[500], 0.16),
      selectedOpacity: 0.16,
    },
  },
  typography: {
    fontFamily: ['"Inter", "sans-serif"'].join(','),
    fontSize: 13,
    button: {
      textTransform: 'none',
    },
    overline: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 4,
  },
});

export const getEnhancedCustomTheme = (mode) => {
  const tokens = getDesignTokens(mode);
  return {
    ...tokens,
    components: {
      MuiEnhancedDateRangePickerDay: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
          today: { borderColor: 'red' },
          startOfWeek: {
            '::after': {
              borderTopLeftRadius: '4px',
              borderBottomLeftRadius: '4px',
            },
            '::before': {
              borderTopLeftRadius: '4px',
              borderBottomLeftRadius: '4px',
            },
          },
          endOfWeek: {
            '::after': {
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px',
            },
            '::before': {
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px',
            },
          },
          previewEnd: {
            [`&:not(.${enhancedDateRangePickerDayClasses.previewEnd})::after`]: {
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px',
            },
          },
          previewStart: {
            [`&:not(.${enhancedDateRangePickerDayClasses.previewStart})::after`]: {
              borderTopLeftRadius: '4px',
              borderBottomLeftRadius: '4px',
            },
          },
        },
      },
    },
  };
};
