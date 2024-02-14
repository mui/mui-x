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
  MuiPieArc?: {
    defaultProps?: ComponentsProps['MuiPieArc'];
    styleOverrides?: ComponentsOverrides['MuiPieArc'];
  };
  MuiPieArcLabel?: {
    defaultProps?: ComponentsProps['MuiPieArcLabel'];
    styleOverrides?: ComponentsOverrides['MuiPieArcLabel'];
  };
  MuiChartsReferenceLine?: {
    defaultProps?: ComponentsProps['MuiChartsReferenceLine'];
    styleOverrides?: ComponentsOverrides['MuiChartsReferenceLine'];
  };
  MuiChartsGrid?: {
    defaultProps?: ComponentsProps['MuiChartsGrid'];
    styleOverrides?: ComponentsOverrides['MuiChartsGrid'];
  };
}

declare module '@mui/material/styles' {
  interface Components extends ChartsComponents {}
}
