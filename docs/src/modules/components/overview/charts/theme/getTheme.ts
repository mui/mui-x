import { alpha, ThemeOptions } from '@mui/material/styles';
import '@mui/x-charts/themeAugmentation';
import '@mui/x-charts-pro/themeAugmentation';

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode,
    },
    typography: {
      fontFamily: ['"Inter", "sans-serif"'].join(','),
      fontSize: 13,
      button: {
        textTransform: 'none',
      },
      overline: { textTransform: 'none', fontWeight: 600 },
      body2: {
        fonsWeight: 300,
        fontSize: '0.8rem',
      },
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
              boxShadow: 'none',
              '&:hover': {
                borderColor: theme.palette.grey[300],
              },
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.grey[400],
            },
          }),
          select: ({ theme }) => ({ padding: theme.spacing(0.5, 1) }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(0.2, 0),
          }),
        },
      },
      MuiChartsLegend: {
        styleOverrides: {
          root: { fontWeight: 400 },
        },
      },
      MuiChartsAxis: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiChartsAxis-line': {
              stroke: alpha(theme.palette.text.secondary, 0.5),
            },
            '& .MuiChartsAxis-tick': {
              stroke: alpha(theme.palette.text.secondary, 0.5),
            },
          }),
        },
      },
    },
  };
};
