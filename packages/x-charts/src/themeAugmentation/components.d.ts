import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface ChartsComponents<Theme = unknown> {
  MuiChartsAxis?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsAxis'];
  };
  MuiChartsXAxis?: {
    defaultProps?: ComponentsProps['MuiChartsXAxis'];
  };
  MuiChartsYAxis?: {
    defaultProps?: ComponentsProps['MuiChartsYAxis'];
  };
  MuiChartsAxisHighlight?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsAxisHighlight'];
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
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsSurface'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
  };
  MuiBarElement?: {
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
    styleOverrides?: ComponentsOverrides<Theme>['MuiAreaElement'];
  };
  MuiLineElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiLineElement'];
  };
  MuiMarkElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiMarkElement'];
  };
  MuiScatterChart?: {
    defaultProps?: ComponentsProps['MuiScatterChart'];
  };
  MuiScatter?: {};
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsComponents<Theme> {}
}
