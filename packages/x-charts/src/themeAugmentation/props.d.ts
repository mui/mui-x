import { BarLabelProps } from '../BarChart/BarLabel';
import { BarChartProps } from '../BarChart/BarChart';
import { BarElementProps } from '../BarChart/BarElement';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { AreaElementProps, LineElementProps, MarkElementProps } from '../LineChart';
import { LineChartProps } from '../LineChart/LineChart';
import { ScatterProps } from '../ScatterChart/Scatter';
import { ScatterChartProps } from '../ScatterChart/ScatterChart';
import { ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';
import { ChartSeriesType } from '../models/seriesType/config';

export interface ChartsComponentsPropsList {
  MuiChartsAxis: ChartsAxisProps;
  MuiChartsXAxis: ChartsXAxisProps;
  MuiChartsYAxis: ChartsYAxisProps;
  MuiChartsAxisHighlight: ChartsAxisHighlightProps;
  MuiChartsClipPath: ChartsClipPathProps;
  MuiChartsGrid: ChartsGridProps;
  MuiChartsLegend: ChartsLegendProps;
  MuiChartsTooltip: ChartsTooltipProps<ChartSeriesType>;
  MuiChartsSurface: ChartsSurfaceProps;

  // BarChart components
  MuiBarChart: BarChartProps;
  MuiBarElement: BarElementProps;
  MuiBarLabel: BarLabelProps;
  // LineChart components
  MuiLineChart: LineChartProps;
  MuiAreaElement: AreaElementProps;
  MuiLineElement: LineElementProps;
  MuiMarkElement: MarkElementProps;
  // ScatterChart components
  MuiScatterChart: ScatterChartProps;
  MuiScatter: ScatterProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsComponentsPropsList {}
}

// disable automatic export
export {};
