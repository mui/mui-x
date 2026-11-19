import type { ComponentsProps } from '@mui/material/styles';

export interface ChartsPremiumComponents {
  // BarChartPremium components
  MuiBarChartPremium?: {
    defaultProps?: ComponentsProps['MuiBarChartPremium'];
  };

  // CandlestickChart components
  MuiCandlestickChart?: {
    defaultProps?: ComponentsProps['MuiCandlestickChart'];
  };

  // HeatmapPremium components
  MuiHeatmapPremium?: {
    defaultProps?: ComponentsProps['MuiHeatmapPremium'];
  };

  // RadialBarChart components
  MuiRadialBarChart?: {
    defaultProps?: ComponentsProps['MuiRadialBarChart'];
  };

  // RadialLineChart components
  MuiRadialLineChart?: {
    defaultProps?: ComponentsProps['MuiRadialLineChart'];
  };

  // ScatterChartPremium components
  MuiScatterChartPremium?: {
    defaultProps?: ComponentsProps['MuiScatterChartPremium'];
  };

  // ChartsGeoDataProviderPremium components
  MuiChartsGeoDataProviderPremium?: {
    defaultProps?: ComponentsProps['MuiChartsGeoDataProviderPremium'];
  };
}

declare module '@mui/material/styles' {
  // The type parameter must match the one declared by @mui/material, even if unused here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Components<Theme = unknown> extends ChartsPremiumComponents {}
}
