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
    MuiChartsRadialDataProvider: {
      defaultProps: {
        // @ts-expect-error invalid MuiChartsRadialDataProvider prop
        someRandomProp: true,
      },
    },
    MuiChartsLayerContainer: {
      defaultProps: {
        title: 'title',
        // @ts-expect-error invalid MuiChartsLayerContainer prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsLayerContainer class key
        constent: { color: 'red' },
      },
    },
    MuiChartsSvgLayer: {
      defaultProps: {
        opacity: 0.5,
        // @ts-expect-error invalid MuiChartsSvgLayer prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiChartsSvgLayer class key
        constent: { color: 'red' },
      },
    },
    MuiChartsRadialGrid: {
      defaultProps: {
        rotation: true,
        // @ts-expect-error invalid MuiChartsRadialGrid prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        radiusLine: { stroke: 'red' },
        // @ts-expect-error invalid MuiChartsRadialGrid class key
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
    },
    MuiBarLabel: {
      defaultProps: {
        dataIndex: 0,
        // @ts-expect-error invalid MuiBarLabel prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
        // @ts-expect-error invalid MuiBarLabel class key
        constent: { color: 'red' },
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
    MuiPieChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiPieChart prop
        someRandomProp: true,
      },
    },
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
    // RadarChart components
    MuiRadarChart: {
      defaultProps: {
        shape: 'circular',
        // @ts-expect-error invalid MuiRadarChart prop
        someRandomProp: true,
      },
    },
  },
});
