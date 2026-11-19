import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiBarChartPremium: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiBarChartPremium prop
        someRandomProp: true,
      },
    },
    MuiCandlestickChart: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiCandlestickChart prop
        someRandomProp: true,
      },
    },
    MuiHeatmapPremium: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiHeatmapPremium prop
        someRandomProp: true,
      },
    },
    MuiRadialBarChart: {
      defaultProps: {
        height: 300,
        // @ts-expect-error invalid MuiRadialBarChart prop
        someRandomProp: true,
      },
    },
    MuiRadialLineChart: {
      defaultProps: {
        height: 300,
        // @ts-expect-error invalid MuiRadialLineChart prop
        someRandomProp: true,
      },
    },
    MuiScatterChartPremium: {
      defaultProps: {
        title: 'toto',
        // @ts-expect-error invalid MuiScatterChartPremium prop
        someRandomProp: true,
      },
    },
    MuiChartsGeoDataProviderPremium: {
      defaultProps: {
        // @ts-expect-error invalid MuiChartsGeoDataProviderPremium prop
        someRandomProp: true,
      },
    },
  },
});
