import { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

export interface ChartsComponents {
  MuiChartsAxis?: {
    defaultProps?: ComponentsProps['MuiChartsAxis'];
    styleOverrides?: ComponentsOverrides['MuiChartsAxis'];
  };
  MuiChartsXAxis?: {
    defaultProps?: ComponentsProps['MuiChartsXAxis'];
    styleOverrides?: ComponentsOverrides['MuiChartsXAxis'];
  };
  MuiChartsYAxis?: {
    defaultProps?: ComponentsProps['MuiChartsYAxis'];
    styleOverrides?: ComponentsOverrides['MuiChartsYAxis'];
  };
  MuiChartsAxisHighlight?: {
    defaultProps?: ComponentsProps['MuiChartsAxisHighlight'];
    styleOverrides?: never; // ComponentsOverrides['MuiChartsAxisHighlight'];
  };
  MuiChartsClipPath?: {
    defaultProps?: ComponentsProps['MuiChartsClipPath'];
    styleOverrides?: never; // ComponentsOverrides['MuiChartsClipPath'];
  };
  MuiChartsLegend?: {
    defaultProps?: ComponentsProps['MuiChartsLegend'];
    styleOverrides?: ComponentsOverrides['MuiChartsLegend'];
  };
  MuiChartsTooltip?: {
    defaultProps?: ComponentsProps['MuiChartsTooltip'];
    styleOverrides?: never; // ComponentsOverrides['MuiChartsTooltip'];
  };
  MuiChartsSurface?: {
    defaultProps?: ComponentsProps['MuiChartsSurface'];
    styleOverrides?: never; // ComponentsOverrides['MuiChartsSurface'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
    styleOverrides?: never; // ComponentsOverrides['MuiBarChart'];
  };
  MuiBarElement?: {
    defaultProps?: ComponentsProps['MuiBarElement'];
    styleOverrides?: ComponentsOverrides['MuiBarElement'];
  };
  MuiLineChart?: {
    defaultProps?: ComponentsProps['MuiLineChart'];
    styleOverrides?: never; // ComponentsOverrides['MuiLineChart'];
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
    styleOverrides?: never; // ComponentsOverrides['MuiScatterChart'];
  };
  MuiScatter?: {
    defaultProps?: ComponentsProps['MuiScatter'];
    styleOverrides?: never; // ComponentsOverrides['MuiScatter'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends ChartsComponents {}
}
