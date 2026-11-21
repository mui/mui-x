import type { ComponentsProps, ComponentsOverrides } from '@mui/material/styles';

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
  MuiChartsRadialGrid?: {
    defaultProps?: ComponentsProps['MuiChartsRadialGrid'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsRadialGrid'];
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
  MuiChartsLayerContainer?: {
    defaultProps?: ComponentsProps['MuiChartsLayerContainer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsLayerContainer'];
  };
  MuiChartsSvgLayer?: {
    defaultProps?: ComponentsProps['MuiChartsSvgLayer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiChartsSvgLayer'];
  };
  MuiChartsDataProvider?: {
    defaultProps?: ComponentsProps['MuiChartsDataProvider'];
  };
  MuiChartsRadialDataProvider?: {
    defaultProps?: ComponentsProps['MuiChartsRadialDataProvider'];
  };
  MuiBarChart?: {
    defaultProps?: ComponentsProps['MuiBarChart'];
  };
  MuiBarLabel?: {
    defaultProps?: ComponentsProps['MuiBarLabel'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarLabel'];
  };
  MuiBarPlot?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiBarPlot'];
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
  MuiPieChart?: {
    defaultProps?: ComponentsProps['MuiPieChart'];
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
    defaultProps?: ComponentsProps['MuiRadarChart'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiRadarChart'];
  };
  MuiGauge?: {
    styleOverrides?: ComponentsOverrides<Theme>['MuiGauge'];
  };
}

declare module '@mui/material/styles' {
  interface Components<Theme = unknown> extends ChartsComponents<Theme> {}
}
