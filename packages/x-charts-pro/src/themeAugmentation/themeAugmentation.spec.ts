import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiBarChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiBarChartPro prop
        someRandomProp: true,
      },
    },
    MuiLineChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiLineChartPro prop
        someRandomProp: true,
      },
    },
    MuiScatterChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiScatterChartPro prop
        someRandomProp: true,
      },
    },
    MuiPieChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiPieChartPro prop
        someRandomProp: true,
      },
    },
    MuiRadarChartPro: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiRadarChartPro prop
        someRandomProp: true,
      },
    },
    MuiHeatmap: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
    },
    MuiHeatmapPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxis class key
        constent: { color: 'red' },
      },
    },

    // FunnelChart components
    MuiFunnelChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiFunnelChart prop
        someRandomProp: true,
      },
      styleOverrides: {
        section: { backgroundColor: 'red' },
        sectionLabel: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiFunnelChart class key
        root: { color: 'red' },
        constent: { color: 'red' },
      },
    },

    MuiFunnelSection: {
      defaultProps: {
        variant: 'outlined',
        // @ts-expect-error invalid MuiFunnelSection prop
        someRandomProp: true,
      },
    },

    MuiFunnelSectionLabel: {
      defaultProps: {
        label: { x: 0, y: 0, value: 'label' },
        // @ts-expect-error invalid MuiFunnelSectionLabel prop
        someRandomProp: true,
      },
    },
  },
});
