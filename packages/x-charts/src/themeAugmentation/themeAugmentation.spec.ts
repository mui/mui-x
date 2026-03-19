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
        direction: 'vertical',
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
    MuiChartsDataProvider: {
      defaultProps: {
        // @ts-expect-error invalid MuiChartsDataProvider prop
        someRandomProp: true,
      },
    },
    // @deprecated Use MuiChartsDataProvider instead
    MuiChartDataProvider: {
      defaultProps: {
        // @ts-expect-error invalid MuiChartDataProvider prop
        someRandomProp: true,
      },
    },

    // BarChart components
    MuiBarChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiBarChart prop
        someRandomProp: true,
      },
    },
    MuiBarPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiBarPlot class key
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
    },
    MuiAreaPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiAreaPlot class key
        constent: { color: 'red' },
      },
    },
    MuiLinePlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiLinePlot class key
        constent: { color: 'red' },
      },
    },
    MuiMarkPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiMarkPlot class key
        constent: { color: 'red' },
      },
    },

    // PieChart components
    MuiPieArcPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiPieArcPlot class key
        constent: { color: 'red' },
      },
    },
    MuiPieArcLabelPlot: {
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiPieArcLabelPlot class key
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
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiScatterChart class key
        constent: { color: 'red' },
      },
    },
  },
});
