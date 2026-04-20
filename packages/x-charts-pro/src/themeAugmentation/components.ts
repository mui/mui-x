import { type ComponentsProps, type ComponentsOverrides } from '@mui/material/styles';

export interface ChartsProComponents<Theme = unknown> {
  // FunnelChart components
  MuiFunnelChart?: {
    defaultProps?: ComponentsProps['MuiFunnelChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiFunnelChart'];
  };
  MuiFunnelSection?: {
    defaultProps?: ComponentsProps['MuiFunnelSection'];
  };
  MuiFunnelSectionLabel?: {
    defaultProps?: ComponentsProps['MuiFunnelSection'];
  };

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

  // SankeyChart components
  MuiSankeyChart?: {
    defaultProps?: ComponentsProps['MuiSankeyChart'];
  };
  MuiSankeyPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiSankeyPlot'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsProComponents<Theme> {}
}
