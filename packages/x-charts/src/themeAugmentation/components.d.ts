import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface ChartsComponents<Theme = unknown> {
  MuiChartsAxis?: {
    defaultProps?: ComponentsProps['MuiChartsAxis'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsAxis'];
  };
  MuiChartsXAxis?: {
    defaultProps?: ComponentsProps['MuiChartsXAxis'];
  };
  MuiChartsYAxis?: {
    defaultProps?: ComponentsProps['MuiChartsYAxis'];
  };
  MuiChartsAxisHighlight?: {
    defaultProps?: ComponentsProps['MuiChartsAxisHighlight'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsAxisHighlight'];
  };
  MuiChartsClipPath?: {
    defaultProps?: ComponentsProps['MuiChartsClipPath'];
  };
  MuiChartsGrid?: {
    defaultProps?: ComponentsProps['MuiChartsGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsGrid'];
  };
  MuiChartsLegend?: {
    defaultProps?: ComponentsProps['MuiChartsLegend'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsLegend'];
  };
  MuiChartsTooltip?: {
    defaultProps?: ComponentsProps['MuiChartsTooltip'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsTooltip'];
  };
  MuiChartsSurface?: {
    defaultProps?: ComponentsProps['MuiChartsSurface'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
  };
  MuiBarElement?: {
    defaultProps?: ComponentsProps['MuiBarElement'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarElement'];
  };
  MuiBarLabel?: {
    defaultProps?: ComponentsProps['MuiBarLabel'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarLabel'];
  };
  MuiLineChart?: {
    defaultProps?: ComponentsProps['MuiLineChart'];
  };
  MuiAreaElement?: {
    defaultProps?: ComponentsProps['MuiAreaElement'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiAreaElement'];
  };
  MuiLineElement?: {
    defaultProps?: ComponentsProps['MuiLineElement'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiLineElement'];
  };
  MuiMarkElement?: {
    defaultProps?: ComponentsProps['MuiMarkElement'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMarkElement'];
  };
  MuiScatterChart?: {
    defaultProps?: ComponentsProps['MuiScatterChart'];
  };
  MuiScatter?: {
    defaultProps?: ComponentsProps['MuiScatter'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsComponents<Theme> {}
}
