import { type ComponentsProps, type ComponentsOverrides } from '@mui/material/styles';

export interface ChartsComponents<Theme = unknown> {
  MuiChartsAxis?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsAxis'];
  };
  MuiChartsXAxis?: {
    defaultProps?: ComponentsProps['MuiChartsXAxis'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsXAxis'];
  };
  MuiChartsYAxis?: {
    defaultProps?: ComponentsProps['MuiChartsYAxis'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsYAxis'];
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
  MuiChartsLocalizationProvider?: {
    defaultProps?: ComponentsProps['MuiChartsLocalizationProvider'];
  };
  MuiChartsTooltip?: {
    defaultProps?: ComponentsProps['MuiChartsTooltip'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsTooltip'];
  };
  MuiChartsSurface?: {
    defaultProps?: ComponentsProps['MuiChartsSurface'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsSurface'];
  };
  MuiChartsDataProvider?: {
    defaultProps?: ComponentsProps['MuiChartsDataProvider'];
  };
  /** @deprecated Use `MuiChartsDataProvider` instead. */
  MuiChartDataProvider?: {
    defaultProps?: ComponentsProps['MuiChartDataProvider'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarChart'];
  };
  /** @deprecated Use `MuiBarChart` instead. */
  MuiBarElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarElement'];
  };
  /** @deprecated Use `MuiBarChart` instead. */
  MuiBarLabel?: {
    defaultProps?: ComponentsProps['MuiBarLabel'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarLabel'];
  };
  MuiLineChart?: {
    defaultProps?: ComponentsProps['MuiLineChart'];
  };
  MuiAreaPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiAreaPlot'];
  };
  MuiLinePlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiLinePlot'];
  };
  MuiMarkPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiMarkPlot'];
  };
  /** @deprecated Use `MuiAreaPlot` instead. */
  MuiAreaElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiAreaElement'];
  };
  /** @deprecated Use `MuiLinePlot` instead. */
  MuiLineElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiLineElement'];
  };
  /** @deprecated Use `MuiMarkPlot` instead. */
  MuiMarkElement?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiMarkElement'];
  };
  MuiPieChart?: {
    defaultProps?: ComponentsProps['MuiPieChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPieChart'];
  };
  /** @deprecated Use `MuiPieChart` instead. */
  MuiPieArc?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiPieArc'];
  };
  /** @deprecated Use `MuiPieChart` instead. */
  MuiPieArcLabel?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiPieArcLabel'];
  };
  MuiScatterChart?: {
    defaultProps?: ComponentsProps['MuiScatterChart'];
  };
  MuiScatter?: {};
  MuiGauge?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiGauge'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsComponents<Theme> {}
}
