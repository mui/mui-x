import type { BarLabelProps } from '../BarChart/BarLabel';
import type { BarChartProps } from '../BarChart/BarChart';
import type { BarElementProps } from '../BarChart/BarElement';
import type { ChartsAxisProps } from '../ChartsAxis';
import type { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import type { ChartsClipPathProps } from '../ChartsClipPath';
import type { ChartsGridProps } from '../ChartsGrid';
import type { ChartsLegendProps } from '../ChartsLegend';
import type { ChartsSurfaceProps } from '../ChartsSurface';
import type { ChartsTooltipProps } from '../ChartsTooltip';
import type { AreaElementProps, LineElementProps, MarkElementProps } from '../LineChart';
import type { LineChartProps } from '../LineChart/LineChart';
import type { ScatterProps } from '../ScatterChart/Scatter';
import type { ScatterChartProps } from '../ScatterChart/ScatterChart';
import type { ChartsXAxisProps, ChartsYAxisProps } from '../models/axis';

export interface ChartsComponentsPropsList {
  MuiChartsAxis: ChartsAxisProps;
  MuiChartsXAxis: ChartsXAxisProps;
  MuiChartsYAxis: ChartsYAxisProps;
  MuiChartsAxisHighlight: ChartsAxisHighlightProps;
  MuiChartsClipPath: ChartsClipPathProps;
  MuiChartsGrid: ChartsGridProps;
  MuiChartsLegend: ChartsLegendProps;
  MuiChartsTooltip: ChartsTooltipProps;
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
