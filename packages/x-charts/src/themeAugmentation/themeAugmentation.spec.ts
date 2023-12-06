import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiChartsAxis: {
      defaultProps: {
        leftAxis: 'test',
        // @ts-expect-error invalid MuiChartsAxis prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxis class key
        constent: { color: 'red' },
      },
    },
    MuiChartsXAxis: {
      defaultProps: {
        axisId: 'test',
        // @ts-expect-error invalid MuiChartsXAxis prop
        someRandomProp: true,
      },
    },
    MuiChartsYAxis: {
      defaultProps: {
        axisId: 'test',
        // @ts-expect-error invalid MuiChartsYAxis prop
        someRandomProp: true,
      },
    },
    MuiChartsAxisHighlight: {
      defaultProps: {
        x: 'line',
        // @ts-expect-error invalid MuiChartsAxisHighlight prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsAxisHighlight class key
        constent: { color: 'red' },
      },
    },
    MuiChartsClipPath: {
      defaultProps: {
        id: 'test',
        // @ts-expect-error invalid MuiChartsClipPath prop
        someRandomProp: true,
      },
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiChartsClipPath class key
      //   constent: { color: 'red' },
      // },
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
        constent: { color: 'red' },
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
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiChartsSurface class key
      //   constent: { color: 'red' },
      // },
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
      defaultProps: {
        id: 'toto',
        // @ts-expect-error invalid MuiBarElement prop
        someRandomProp: true,
      },
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
      defaultProps: {
        id: 'toto',
        // @ts-expect-error invalid MuiAreaElement prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiAreaElement class key
        constent: { color: 'red' },
      },
    },
    MuiLineElement: {
      defaultProps: {
        id: 'toto',
        // @ts-expect-error invalid MuiLineElement prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiLineElement class key
        constent: { color: 'red' },
      },
    },
    MuiMarkElement: {
      defaultProps: {
        id: 'toto',
        // @ts-expect-error invalid MuiMarkElement prop
        someRandomProp: true,
      },
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
    MuiScatter: {
      defaultProps: {
        markerSize: 10,
        // @ts-expect-error invalid MuiScatter prop
        someRandomProp: true,
      },
      // styleOverrides: {
      //   root: { backgroundColor: 'red' },
      //   // @ts-expect-error invalid MuiScatter class key
      //   constent: { color: 'red' },
      // },
    },
  },
});
