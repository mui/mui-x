import { type ComponentsProps, type ComponentsOverrides } from '@mui/material/styles';

export interface ChartsProComponents<Theme = unknown> {
  // FunnelChart components
  MuiFunnelChart?: {
    defaultProps?: ComponentsProps['MuiFunnelChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiFunnelChart'];
  };
  MuiFunnelSection?: {
    /** @deprecated Use `MuiFunnelChart` instead. */
    styleOverrides?: ComponentsOverrides<Theme>['MuiFunnelSection'];
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
