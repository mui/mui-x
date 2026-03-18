import { type GaugeClassKey } from '../Gauge';
import { type RadarClassKey } from '../RadarChart/radarClasses';
import { type BarClassKey } from '../BarChart/barClasses';
import { type BarLabelClassKey } from '../BarChart';
import { type BarElementClassKey } from '../BarChart/barElementClasses';
import { type ScatterClassKey } from '../ScatterChart/scatterClasses';
import { type ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import { type ChartsGridClassKey } from '../ChartsGrid';
import { type ChartsTooltipClassKey } from '../ChartsTooltip';
import type { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';

export interface ChartsComponentNameToClassKey {
  MuiChartsAxis: 'root'; //  Only the root component of axes is styled. We should probably remove this one in v8
  MuiChartsXAxis: 'root'; //  Only the root component of axes is styled
  MuiChartsYAxis: 'root'; //  Only the root component of axes is styled

  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsLegend: 'root';
  MuiChartsGrid: ChartsGridClassKey;
  MuiChartsTooltip: ChartsTooltipClassKey;

  MuiChartsSurface: 'root';

  // BarChart components
  MuiBarChart: BarClassKey;
  /** @deprecated Use `MuiBarChart` instead. */
  MuiBarElement: BarElementClassKey;
  /** @deprecated Use `MuiBarChart` instead. */
  MuiBarLabel: BarLabelClassKey;

  // PieChart components
  MuiPieArcPlot: 'root';
  MuiPieArcLabelPlot: 'root';

  // LineChart components
  MuiAreaPlot: 'root';
  MuiLinePlot: 'root';
  MuiMarkPlot: 'root';
  /** @deprecated Use `MuiLineChart` instead. */
  MuiAreaElement: AreaElementClassKey;
  /** @deprecated Use `MuiLineChart` instead. */
  MuiLineElement: LineElementClassKey;
  /** @deprecated Use `MuiLineChart` instead. */
  MuiMarkElement: MarkElementClassKey;

  // ScatterChart components
  MuiScatterChart: ScatterClassKey;

  // RadarChart components
  MuiRadarChart: RadarClassKey;

  // Gauge components
  MuiGauge: GaugeClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsComponentNameToClassKey {}
}

// disable automatic export
export {};
