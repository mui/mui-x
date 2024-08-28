import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiChartsAxis: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxis class key
        line: { color: 'red' },
      },
    },
    MuiChartsXAxis: {
      defaultProps: {
        axisId: 'test',
        // @ts-expect-error invalid MuiChartsXAxis prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsXAxis class key
        line: { color: 'red' },
      },
    },
    MuiChartsYAxis: {
      defaultProps: {
        axisId: 'test',
        // @ts-expect-error invalid MuiChartsYAxis prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsYAxis class key
        line: { color: 'red' },
      },
    },
    MuiChartsAxisHighlight: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxisHighlight class key
        constent: { color: 'red' },
      },
    },
    MuiChartsLegend: {
      defaultProps: {
        direction: 'row',
        // @ts-expect-error invalid MuiChartsLegend prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsLegend class key
        mark: { color: 'red' },
      },
    },
    MuiChartsTooltip: {
      defaultProps: {
        trigger: 'item',
        // @ts-expect-error invalid MuiChartsTooltip prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsTooltip class key
        constent: { color: 'red' },
      },
    },
    MuiChartsSurface: {
      defaultProps: {
        title: 'title',
        // @ts-expect-error invalid MuiChartsSurface prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsSurface class key
        constent: { color: 'red' },
      },
    },

    // BarChart components
    MuiBarChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiBarChart prop
        someRandomProp: true,
      },
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiBarChart class key
      //   constent: { color: 'red' },
      // },
    },
    MuiBarElement: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiBarElement class key
        constent: { color: 'red' },
      },
    },
    // LineChart components
    MuiLineChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiLineChart prop
        someRandomProp: true,
      },
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiLineChart class key
      //   constent: { color: 'red' },
      // },
    },
    MuiAreaElement: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiAreaElement class key
        constent: { color: 'red' },
      },
    },
    MuiLineElement: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiLineElement class key
        constent: { color: 'red' },
      },
    },
    MuiMarkElement: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiMarkElement class key
        constent: { color: 'red' },
      },
    },
    // ScatterChart components
    MuiScatterChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiScatterChart prop
        someRandomProp: true,
      },
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiScatterChart class key
      //   constent: { color: 'red' },
      // },
    },
  },
});
