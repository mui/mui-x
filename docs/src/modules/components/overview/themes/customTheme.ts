import { alpha, ThemeOptions } from '@mui/material/styles';
import { dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { Config, PaletteMode } from './themes.types';

declare module '@mui/material/styles' {
  interface Mixins {
    density: {
      spacing: number;
      width: number;
      height: number;
    };
  }
}

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
export const orange = {
  50: 'hsl(20, 41%, 92%)',
  100: 'hsl(20, 55%, 83%)',
  200: 'hsl(20, 57%, 78%)',
  300: 'hsl(20, 70%, 70%)',
  400: 'hsl(20, 70%, 65%)',
  500: 'hsl(20, 70%, 55%)',
  600: 'hsl(20, 70%, 48%)',
  700: 'hsl(20, 78%, 40%)',
  800: 'hsl(20, 85%, 28%)',
  900: 'hsl(20, 100%, 19%)',
};
export const green = {
  50: 'hsl(168, 19%, 88%)',
  100: 'hsl(168, 26%, 80%)',
  200: 'hsl(168, 26%, 74%)',
  300: 'hsl(168, 29%, 64%)',
  400: 'hsl(168, 31%, 49%)',
  500: 'hsl(168, 39%, 40%)',
  600: 'hsl(168, 37%, 35%)',
  700: 'hsl(168, 43%, 24%)',
  800: 'hsl(168, 57%, 18%)',
  900: 'hsl(168, 61%, 11%)',
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

const getDesignTokens = (mode: PaletteMode, config: Config): ThemeOptions => {
  let color = brand;
  if (config.color === 'orange') {
    color = orange;
  } else if (config.color === 'green') {
    color = green;
  }

  let corner = 4;
  if (config.corner === 'rectangular') {
    corner = 1;
  } else if (config.corner === 'rounded') {
    corner = 20;
  }

  let density = 32;
  let spacing = 4;
  if (config.density === 'compact') {
    density = 28;
    spacing = 2;
  } else if (config.density === 'spacious') {
    density = 36;
  }

  let family = ['"Roboto", "sans-serif"'].join(',');
  if (config.typography === 'Inter') {
    family = ['"Inter", "sans-serif"'].join(',');
  } else if (config.typography === 'Menlo') {
    family = ['"Menlo", "monospace"'].join(',');
  }

  return {
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
        light: color[200],
        main: color[500],
        dark: color[700],
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: color[50],
          light: color[300],
          main: color[400],
          dark: color[800],
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
      fontFamily: family,
      fontSize: 13,
      button: {
        textTransform: 'none',
      },
      overline: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: corner,
    },
    mixins: {
      density: {
        spacing,
        width: density,
        height: density,
      },
    },
  };
};

export const getCustomTheme = (mode: PaletteMode, config: Config): ThemeOptions => {
  const tokens = getDesignTokens(mode, config);

  return {
    ...tokens,
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => {
            return {
              padding: 16,
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
              boxShadow: '1px 2px 8px -1px rgba(0, 0, 0, 0.1)',
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
                border: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
              }),
            };
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow: 'none',
            borderRadius: theme.shape.borderRadius,
            textTransform: 'none',
            fontWeight: theme.typography.fontWeightMedium,
            letterSpacing: 0,
            color: theme.palette.grey[600],
            border: 'none',
            backgroundColor: theme.palette.grey[50],
            '&:hover': {
              backgroundColor: theme.palette.grey[100],
            },
            '&:active': {
              backgroundColor: theme.palette.grey[200],
            },
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[50],
              border: '1px solid',
              borderColor: theme.palette.grey[700],
              backgroundColor: theme.palette.grey[800],
              '&:hover': {
                backgroundColor: theme.palette.grey[800],
                borderColor: theme.palette.grey[500],
              },
              '&:active': {
                backgroundColor: theme.palette.grey[900],
              },
            }),
            variants: [
              {
                props: {
                  size: 'small',
                },
                style: {
                  minWidth: '2rem',
                  height: '2rem',
                  padding: '0.25rem',
                },
              },
            ],
          }),
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          shortcuts: ({ theme }) => ({
            padding: '12px 24px 12px 12px',
            height: 'fit-content',

            '&.MuiList-root': {
              maxWidth: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 48,
            },
            '& .MuiListItem-root': {
              padding: '3px 0',
            },
          }),
          contentWrapper: ({ theme }) => ({
            width: 'fit-content',
            ...(config.layout === 'horizontal'
              ? {
                  borderRight: `1px solid ${theme.palette.divider}`,
                  padding: '12px 12px 12px 24px',
                }
              : { padding: '6px 24px' }),
          }),
          actionBar: ({ theme }) => ({
            padding: '12px 24px',
            borderTop: `1px solid ${theme.palette.divider}`,
            ...(config.layout === 'vertical' && { padding: '6px 24px' }),
          }),
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 24,
            ...(config.layout === 'vertical' && { paddingTop: 8, paddingBottom: 8 }),
            '& .MuiTypography-overline': {
              color: theme.palette.primary.main,
            },
          }),
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          button: {
            minWidth: 32,
            width: 32,
            height: 32,
            marginLeft: 0,
            marginRight: 0,
            fontSize: '1.25rem',
          },
          spacer: {
            width: 8,
          },
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
      MuiDateCalendar: {
        styleOverrides: {
          root: { height: 'fit-content', width: 'fit-content' },
        },
      },
      MuiPickersSlideTransition: {
        styleOverrides: {
          root: ({ theme }) => ({
            minWidth: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6,
            '&.MuiDayCalendar-slideTransition': {
              minWidth: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6,
              minHeight: theme.mixins.density.height * 7 + theme.mixins.density.spacing * 6,
            },
          }),
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          monthContainer: ({ theme }) => ({
            height: theme.mixins.density.height * 6 + theme.mixins.density.spacing * 6,
          }),
          root: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6,
          }),
          weekContainer: ({ theme }) => ({
            height: theme.mixins.density.height,
            gap: theme.mixins.density.spacing,
            margin: '4px 0',
          }),
          slideTransition: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6,
          }),
          header: { gap: 4 },
          weekDayLabel: ({ theme }) => ({
            margin: 0,
            fontSize: '12px',
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,
          }),
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            fontSize: '0.8rem',
            fontWeight: 500,
            border: 'none',
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,

            '&:hover': {
              border: 'none',
            },
            '&.Mui-selected': {
              transform: 'none',
            },
          }),
          today: ({ theme }) => ({
            '&:not(.Mui-selected)': {
              borderColor: theme.palette.primary.main,
              '&:hover': {
                border: theme.palette.primary.main,
              },
            },
          }),
        },
      },
      MuiMonthCalendar: {
        styleOverrides: {
          button: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      MuiYearCalendar: {
        styleOverrides: {
          button: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      MuiDateRangePickerDay: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            ':first-of-type': {
              [`& .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
                borderRadius: theme.shape.borderRadius,
                borderColor: 'transparent',
              },
              [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]: {
                borderRadius: theme.shape.borderRadius,
              },
            },
            ':last-of-type': {
              [`& .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
                borderRadius: theme.shape.borderRadius,
                borderColor: 'transparent',
              },
              [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]: {
                borderRadius: theme.shape.borderRadius,
              },
            },
          }),
          rangeIntervalPreview: {
            border: 'none',
          },
          rangeIntervalDayPreview: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            borderColor: 'transparent',
            backgroundColor: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[700],
            }),
          }),

          rangeIntervalDayHighlight: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.primary.light, 0.4),
            ...theme.applyStyles('dark', {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
            }),
          }),
          dayInsideRangeInterval: { transform: 'none' },
          dayOutsideRangeInterval: { transform: 'none' },
        },
      },
    },
  };
};
