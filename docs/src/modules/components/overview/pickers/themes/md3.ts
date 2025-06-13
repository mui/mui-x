import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
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

export const surfaceGreenLight = {
  containerLowest: '#FFFFFF',
  containerLow: '#F1FAF2',
  container: '#ECF4ED',
  containerHigh: '#E6EEE7',
  containerHighest: '#EFF5EF',
  onSurface: '#1C1F1D',
  onSurfaceVariant: '#464A46',
};
export const surfaceGreenDark = {
  containerLowest: '#151515',
  containerLow: '#1B1E1B',
  container: '#1F231F',
  containerHigh: '#292F2A',
  containerHighest: '#343A35',
  onSurface: '#E0E8E1',
  onSurfaceVariant: '#C4CFC5',
};

export const green = {
  50: '#CBE8CC',
  100: '#A4CAA6',
  200: '#7EAF81',
  300: '#6CA06F',
  400: '#588E5B',
  500: '#417844',
  600: '#366B39',
  700: '#2A5C2D',
  800: '#16461A',
  900: '#0F3511',
};
export const surfacePinkLight = {
  containerLowest: '#FFFFFF',
  containerLow: '#FAF1F8',
  container: '#F4ECF2',
  containerHigh: '#EEE6EC',
  containerHighest: '#E8E0E6',
  onSurface: '#201B1F',
  onSurfaceVariant: '#4E454C',
};
export const surfacePinkDark = {
  containerLowest: '#151515',
  containerLow: '#1E1B1D',
  container: '#231F22',
  containerHigh: '#2F292E',
  containerHighest: '#3A3439',
  onSurface: '#E8E0E6',
  onSurfaceVariant: '#CFC4CC',
};

export const pink = {
  50: '#FFD7F5',
  100: '#FDB7EB',
  200: '#DE81C7',
  300: '#CB65B2',
  400: '#B54C9B',
  500: '#A03786',
  600: '#8C2071',
  700: '#77145F',
  800: '#520C40',
  900: '#3C072F',
};

export const surfacePurpleLight = {
  containerLowest: '#FFFFFF',
  containerLow: '#F8F1FA',
  container: '#F2ECF4',
  containerHigh: '#EDE6EE',
  containerHighest: '#E7E0E8',
  onSurface: '#1D1B20',
  onSurfaceVariant: '#49454E',
};
export const surfacePurpleDark = {
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

const getDesignTokens = (mode: PaletteMode, config: Config): ThemeOptions => {
  let color = purple;
  let surfaceLight = surfacePurpleLight;
  let surfaceDark = surfacePurpleDark;
  if (config.color === 'pink') {
    color = pink;
    surfaceLight = surfacePinkLight;
    surfaceDark = surfacePinkDark;
  } else if (config.color === 'green') {
    color = green;
    surfaceLight = surfaceGreenLight;
    surfaceDark = surfaceGreenDark;
  }

  let corner = 20;
  if (config.corner === 'rectangular') {
    corner = 1;
  } else if (config.corner === 'medium') {
    corner = 5;
  }

  let density = 36;
  let spacing = 4;
  if (config.density === 'compact') {
    density = 32;
    spacing = 2;
  } else if (config.density === 'spacious') {
    density = 40;
    spacing = 2;
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
        default: surfaceLight.containerLow,
        paper: surfaceLight.containerHigh,
        ...(mode === 'dark' && {
          default: surfaceDark.containerLow,
          paper: surfaceDark.containerHigh,
        }),
      },
      primary: {
        light: color[200],
        main: color[500],
        dark: color[700],
        contrastText: surfaceLight.containerLowest,
        ...(mode === 'dark' && {
          contrastText: surfaceDark.containerLowest,
          light: color[400],
          main: color[500],
          dark: color[800],
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
      fontFamily: family,
      fontSize: 14,
      button: {
        textTransform: 'none',
      },
      overline: { textTransform: 'none', fontSize: '0.825rem', fontWeight: 500 },
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

export const getMD3Theme = (mode: PaletteMode, config: Config): ThemeOptions => {
  const tokens = getDesignTokens(mode, config);

  return {
    ...tokens,
    components: {
      MuiPickersLayout: {
        styleOverrides: {
          root: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
            '& .MuiPickersLayout-actionBar': {
              height: '60px',
            },
          }),
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
            height: 'fit-content',
            maxHeight: 'initial',
          },
          viewTransitionContainer: ({ theme }) => ({
            height: theme.mixins.density.height * 7 + theme.mixins.density.spacing * 6,
          }),
        },
      },
      MuiYearCalendar: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '0 20px',
            borderBottom: `1px solid ${theme.palette.divider}`,
            alignContent: 'flex-start',
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
            columnGap: '12px',
          }),
          button: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            height: theme.mixins.density.height,
          }),
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          monthContainer: ({ theme }) => ({
            height: theme.mixins.density.height * 6 + theme.mixins.density.spacing * 6,
          }),
          root: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
            height: theme.mixins.density.height * 7 + theme.mixins.density.spacing * 6,
          }),
          weekContainer: ({ theme }) => ({
            height: theme.mixins.density.height,
            gap: theme.mixins.density.spacing,
          }),
          slideTransition: ({ theme }) => ({
            height: theme.mixins.density.height * 7 + theme.mixins.density.spacing * 6,
          }),
          header: ({ theme }) => ({ gap: theme.mixins.density.spacing }),
          weekDayLabel: ({ theme }) => ({
            margin: 0,
            fontSize: '14px',
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,
          }),
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: 'flex',
            fontSize: '14px',
            margin: 0,
            borderRadius: theme.shape.borderRadius,
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,
          }),
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
