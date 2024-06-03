import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface ChartsComponents {
  MuiChartsAxis?: {
    defaultProps?: ComponentsProps['MuiChartsAxis'];
    styleOverrides?: ComponentsOverrides['MuiChartsAxis'];
  };
  MuiChartsXAxis?: {
    defaultProps?: ComponentsProps['MuiChartsXAxis'];
  };
  MuiChartsYAxis?: {
    defaultProps?: ComponentsProps['MuiChartsYAxis'];
  };
  MuiChartsAxisHighlight?: {
    defaultProps?: ComponentsProps['MuiChartsAxisHighlight'];
    styleOverrides?: ComponentsOverrides['MuiChartsAxisHighlight'];
  };
  MuiChartsClipPath?: {
    defaultProps?: ComponentsProps['MuiChartsClipPath'];
  };
  MuiChartsGrid?: {
    defaultProps?: ComponentsProps['MuiChartsGrid'];
    styleOverrides?: ComponentsOverrides['MuiChartsGrid'];
  };
  MuiChartsLegend?: {
    defaultProps?: ComponentsProps['MuiChartsLegend'];
    styleOverrides?: ComponentsOverrides['MuiChartsLegend'];
  };
  MuiChartsTooltip?: {
    defaultProps?: ComponentsProps['MuiChartsTooltip'];
    styleOverrides?: ComponentsOverrides['MuiChartsTooltip'];
  };
  MuiChartsSurface?: {
    defaultProps?: ComponentsProps['MuiChartsSurface'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
  };
  MuiBarElement?: {
    defaultProps?: ComponentsProps['MuiBarElement'];
    styleOverrides?: ComponentsOverrides['MuiBarElement'];
  };
  MuiBarLabel?: {
    defaultProps?: ComponentsProps['MuiBarLabel'];
    styleOverrides?: ComponentsOverrides['MuiBarLabel'];
  };
  MuiLineChart?: {
    defaultProps?: ComponentsProps['MuiLineChart'];
  };
  MuiAreaElement?: {
    defaultProps?: ComponentsProps['MuiAreaElement'];
    styleOverrides?: ComponentsOverrides['MuiAreaElement'];
  };
  MuiLineElement?: {
    defaultProps?: ComponentsProps['MuiLineElement'];
    styleOverrides?: ComponentsOverrides['MuiLineElement'];
  };
  MuiMarkElement?: {
    defaultProps?: ComponentsProps['MuiMarkElement'];
    styleOverrides?: ComponentsOverrides['MuiMarkElement'];
  };
  MuiScatterChart?: {
    defaultProps?: ComponentsProps['MuiScatterChart'];
  };
  MuiScatter?: {
    defaultProps?: ComponentsProps['MuiScatter'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends ChartsComponents {}
}
