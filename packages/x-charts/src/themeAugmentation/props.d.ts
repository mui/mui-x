import { BarLabelProps } from '../BarChart/BarLabel';
import { BarChartProps } from '../BarChart/BarChart';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { LineChartProps } from '../LineChart/LineChart';
import { ScatterChartProps } from '../ScatterChart/ScatterChart';
import { PieChartProps } from '../PieChart/PieChart';
import { ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';
import { ChartSeriesType } from '../models/seriesType/config';

export interface ChartsComponentsPropsList {
  MuiChartsXAxis: ChartsXAxisProps;
  MuiChartsYAxis: ChartsYAxisProps;
  MuiChartsGrid: ChartsGridProps;
  MuiChartsLegend: ChartsLegendProps;
  MuiChartsTooltip: ChartsTooltipProps<ChartSeriesType>;
  MuiChartsSurface: ChartsSurfaceProps;

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
