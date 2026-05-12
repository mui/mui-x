import { alpha, ThemeOptions } from '@mui/material/styles';
import '@mui/x-charts/themeAugmentation';
import '@mui/x-charts-pro/themeAugmentation';
import { overviewChartPalette } from './colors';

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  const chartColorDefaults = {
    colors: overviewChartPalette,
  };

  return {
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#8EADDB' : '#406AA8',
      },
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
      MuiChartsDataProvider: {
        defaultProps: chartColorDefaults,
      },
      MuiBarChart: {
        defaultProps: chartColorDefaults,
      },
      MuiLineChart: {
        defaultProps: chartColorDefaults,
      },
      MuiScatterChart: {
        defaultProps: chartColorDefaults,
      },
      MuiBarChartPro: {
        defaultProps: chartColorDefaults,
      },
      MuiLineChartPro: {
        defaultProps: chartColorDefaults,
      },
      MuiScatterChartPro: {
        defaultProps: chartColorDefaults,
      },
      MuiHeatmap: {
        defaultProps: chartColorDefaults,
      },
      MuiFunnelChart: {
        defaultProps: chartColorDefaults,
      },
      MuiSankeyChart: {
        defaultProps: chartColorDefaults,
      },
      MuiChartsXAxis: { defaultProps: { tickLabelStyle: { fontWeight: 400 } } },
      MuiChartsYAxis: { defaultProps: { tickLabelStyle: { fontWeight: 400 } } },
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
