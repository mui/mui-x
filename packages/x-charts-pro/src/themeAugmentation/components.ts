import { type ComponentsProps, type ComponentsOverrides } from '@mui/material/styles';

export interface ChartsProComponents<Theme = unknown> {
  // FunnelChart components
  MuiFunnelChart?: {
    defaultProps?: ComponentsProps['MuiFunnelChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiFunnelChart'];
  };
  /** @deprecated Use `MuiFunnelChart` instead. */
  MuiFunnelSection?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiFunnelSection'];
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
    styleOverrides?: ComponentsOverrides<Theme>['MuiHeatmap'];
  };
  // ScatterChartPro components
  MuiScatterChartPro?: {
    defaultProps?: ComponentsProps['MuiScatterChartPro'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsProComponents<Theme> {}
}
