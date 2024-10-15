import { ThemeOptions } from '@mui/material/styles';
import { dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';

export const surfaceLight = {
  containerLowest: '#FFFFFF',
  containerLow: '#F8F1FA',
  container: '#F2ECF4',
  containerHigh: '#EDE6EE',
  containerHighest: '#E7E0E8',
  onSurface: '#1D1B20',
  onSurfaceVariant: '#49454E',
};
export const surfaceDark = {
  containerLowest: '#0F0D13',
  containerLow: '#1D1B20',
  container: '#211F24',
  containerHigh: '#2C292F',
  containerHighest: '#36343A',
  onSurface: '#E7E0E8',
  onSurfaceVariant: '#CBC4CF',
};

export const purple = {
  50: '#ECE6F0',
  100: '#F7EDFF',
  200: '#EBDDFF',
  300: '#D3BBFF',
  400: '#BC99FF',
  500: '#6750A4',
  600: '#895EDB',
  700: '#6F43C0',
  800: '#5727A6',
  900: '#3F008D',
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

type PaletteMode = 'light' | 'dark';

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    background: {
      default: surfaceLight.containerLow,
      paper: surfaceLight.containerHigh,
      ...(mode === 'dark' && {
        default: surfaceDark.containerLow,
        paper: surfaceDark.containerHigh,
      }),
    },
    primary: {
      light: purple[200],
      main: purple[500],
      dark: purple[700],
      contrastText: '#fff',
      ...(mode === 'dark' && {
        contrastText: purple[50],
        light: purple[400],
        main: purple[500],
        dark: purple[800],
      }),
    },
    text: {
      primary: surfaceLight.onSurface,
      secondary: surfaceLight.onSurfaceVariant,
      ...(mode === 'dark' && {
        primary: surfaceDark.onSurface,
        secondary: surfaceDark.onSurfaceVariant,
      }),
    },
  },
  typography: {
    // fontFamily: ['"Inter", "sans-serif"'].join(','),
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
    overline: { textTransform: 'none', fontSize: '0.825rem', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
});

export const getMD3Theme = (mode: PaletteMode): ThemeOptions => {
  const tokens = getDesignTokens(mode);

  return {
    ...tokens,
    components: {
      MuiPickersLayout: {
        styleOverrides: {
          root: {
            '& .MuiPickersLayout-actionBar': {
              height: '60px',
            },
          },
          shortcuts: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderTop: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            height: '56px',
            minHeight: '56px',
            margin: 0,
            padding: 0,
          }),
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            height: '120px',
            padding: '18px 14px 14px 26px',
          }),
          content: { alignItems: 'flex-end' },
        },
      },

      MuiDateCalendar: {
        styleOverrides: {
          root: {
            width: 'fit-content',
          },
        },
      },

      MuiMonthCalendar: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '0 24px',
            height: '280px',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },

      MuiYearCalendar: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '0 24px',
            borderBottom: `1px solid ${theme.palette.divider}`,
            alignContent: 'flex-start',
          }),
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          weekContainer: {
            gap: '4px',
          },
          slideTransition: { position: 'relative' },
          header: {
            gap: '4px',
            padding: '4px 0',
          },
          weekDayLabel: { margin: 0, fontSize: '14px' },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            display: 'flex',
            fontSize: '14px',
            margin: 0,
          },
        },
      },
      MuiPickersMonth: {
        styleOverrides: {
          monthButton: ({ theme, ownerState }) => ({
            ...(!ownerState.selected && { color: theme.palette.text.secondary }),
          }),
        },
      },
      MuiPickersYear: {
        styleOverrides: {
          yearButton: ({ theme, ownerState }) => ({
            ...(!ownerState.selected && { color: theme.palette.text.secondary }),
          }),
        },
      },
      MuiDateRangePickerDay: {
        styleOverrides: {
          day: {
            transform: 'scale(1)',
          },
          root: {
            display: 'flex',
            ':first-of-type': {
              width: '100%',

              [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]: {
                borderRadius: 0,
              },
            },
            ':last-of-type': {
              width: '100%',
              [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]: {
                borderRadius: 0,
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '28px',
          },
        },
      },
    },
  };
};
