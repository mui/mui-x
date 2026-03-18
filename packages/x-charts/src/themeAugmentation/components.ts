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
  MuiPieArcPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiPieArcPlot'];
  };
  MuiPieArcLabelPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiPieArcLabelPlot'];
  };
  MuiScatterChart?: {
    defaultProps?: ComponentsProps['MuiScatterChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiScatterChart'];
  };
  /** @deprecated Use `MuiScatterChart` instead. */
  MuiScatter?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiScatterChart'];
  };
  MuiRadarChart?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiRadarChart'];
  };
  MuiGauge?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiGauge'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsComponents<Theme> {}
}
