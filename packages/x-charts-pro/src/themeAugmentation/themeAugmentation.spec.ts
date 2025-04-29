import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiBarChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
    },
    MuiLineChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
    },
    MuiScatterChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
    },
    MuiHeatmap: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
      styleOverrides: {
        highlighted: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxis class key
        constent: { color: 'red' },
      },
    },
  },
});
