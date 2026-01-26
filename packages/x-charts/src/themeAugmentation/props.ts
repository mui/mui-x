import { type BarLabelProps } from '../BarChart/BarLabel';
import { type BarChartProps } from '../BarChart/BarChart';
import { type ChartsGridProps } from '../ChartsGrid';
import { type ChartsLegendProps } from '../ChartsLegend';
import { type ChartsSurfaceProps } from '../ChartsSurface';
import { type ChartsTooltipProps } from '../ChartsTooltip';
import { type LineChartProps } from '../LineChart/LineChart';
import { type ScatterChartProps } from '../ScatterChart/ScatterChart';
import { type PieChartProps } from '../PieChart/PieChart';
import { type ChartsLocalizationProviderProps } from '../ChartsLocalizationProvider';
import { type ChartDataProviderProps } from '../ChartDataProvider';

export interface ChartsComponentsPropsList {
  MuiChartsGrid: ChartsGridProps;
  MuiChartsLegend: ChartsLegendProps;
  MuiChartsLocalizationProvider: ChartsLocalizationProviderProps;
  MuiChartsTooltip: ChartsTooltipProps;
  MuiChartsSurface: ChartsSurfaceProps;

  MuiChartDataProvider: ChartDataProviderProps;

  // BarChart components
  MuiBarChart: BarChartProps;
  MuiBarLabel: BarLabelProps;
  // LineChart components
  MuiLineChart: LineChartProps;
  // ScatterChart components
  MuiScatterChart: ScatterChartProps;
  // PieChart components
  MuiPieChart: PieChartProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsComponentsPropsList {}
}

// disable automatic export
export {};
