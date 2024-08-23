import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface ChartsProComponents<Theme = unknown> {
  // BarChartPro components
  MuiBarChartPro: {
    defaultProps?: ComponentsProps['MuiBarChartPro'];
  };
  // LineChartPro components
  MuiLineChartPro: {
    defaultProps?: ComponentsProps['MuiLineChartPro'];
  };
  // Heatmap components
  MuiHeatmap: {
    defaultProps?: ComponentsProps['MuiHeatmap'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiHeatmap'];
  };
  MuiHeatmapItem: {
    defaultProps?: ComponentsProps['MuiHeatmapItem'];
  };
  MuiHeatmapPlot: {
    defaultProps?: ComponentsProps['MuiHeatmapPlot'];
  };
  // ScatterChartPro components
  MuiScatterChartPro: {
    defaultProps?: ComponentsProps['MuiScatterChartPro'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsProComponents<Theme> {}
}
