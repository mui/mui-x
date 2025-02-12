import { ThemeOptions } from '@mui/material/styles';
import { purple, pink } from '@mui/material/colors';
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

export function getDefaultTheme(mode: PaletteMode, config: Config): ThemeOptions {
  let paletteAppendix = {};
  if (config.color === 'purple') {
    paletteAppendix = {
      primary: {
        light: purple[200],
        main: purple[500],
        dark: purple[700],
        ...(mode === 'dark' && {
          light: purple[300],
          main: purple[400],
          dark: purple[800],
        }),
      },
    };
  } else if (config.color === 'pink') {
    paletteAppendix = {
      primary: {
        light: pink[200],
        main: pink[500],
        dark: purple[700],
        ...(mode === 'dark' && {
          light: pink[300],
          main: pink[400],
          dark: pink[800],
        }),
      },
    };
  }
  let typography = {};
  if (config.typography === 'Inter') {
    typography = { fontFamily: ['"Inter", "sans-serif"'].join(',') };
  } else if (config.typography === 'Menlo') {
    typography = { fontFamily: ['"Menlo", "monospace"'].join(',') };
  }

  let density = { width: 36, height: 36, spacing: 4 };
  if (config.density === 'compact') {
    density = { width: 32, height: 32, spacing: 2 };
  } else if (config.density === 'spacious') {
    density = { width: 40, height: 40, spacing: 2 };
  }

  return {
    palette: {
      mode,
      ...paletteAppendix,
    },
    typography,
    mixins: {
      density,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: { boxShadow: '1px 2px 8px -1px rgba(0, 0, 0, 0.1)' },
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          shortcuts: ({ theme }) => ({
            '&.MuiList-root': {
              maxWidth: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
            },
          }),
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: ({ theme }) => ({
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,
          }),
        },
      },
      MuiDateRangeCalendar: {
        styleOverrides: {
          monthContainer: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
          }),
        },
      },
      MuiDayCalendar: {
        styleOverrides: {
          monthContainer: ({ theme }) => ({
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
          }),
          root: ({ theme }) => ({
            height: theme.mixins.density.height * 7 + theme.mixins.density.spacing * 6,
            width: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6 + 40,
          }),
          weekDayLabel: ({ theme }) => ({
            width: theme.mixins.density.width,
            height: theme.mixins.density.height,
          }),
          slideTransition: ({ theme }) => ({
            minWidth: theme.mixins.density.width * 7 + theme.mixins.density.spacing * 6,
          }),
        },
      },
    },
  };
}
