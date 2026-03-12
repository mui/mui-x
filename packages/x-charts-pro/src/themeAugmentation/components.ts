import { type ComponentsProps, type ComponentsOverrides } from '@mui/material/styles';

export interface ChartsProComponents<Theme = unknown> {
  // BarChartPro components
  MuiBarChartPro?: {
    defaultProps?: ComponentsProps['MuiBarChartPro'];
  };
  // LineChartPro components
  MuiLineChartPro?: {
    defaultProps?: ComponentsProps['MuiLineChartPro'];
  };

  // Heatmap components
  MuiHeatmap?: {
    defaultProps?: ComponentsProps['MuiHeatmap'];
  };
  MuiHeatmapPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiHeatmapPlot'];
  };

  // ScatterChartPro components
  MuiScatterChartPro?: {
    defaultProps?: ComponentsProps['MuiScatterChartPro'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsProComponents<Theme> { }
}
