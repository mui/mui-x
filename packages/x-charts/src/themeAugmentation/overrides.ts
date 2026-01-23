import { type GaugeClassKey } from '../Gauge';
import { type BarLabelClassKey } from '../BarChart';
import { type BarElementClassKey } from '../BarChart/barElementClasses';
import { type ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import { type ChartsGridClassKey } from '../ChartsGrid';
import { type ChartsTooltipClassKey } from '../ChartsTooltip';
import {
  type AreaElementClassKey,
  type LineElementClassKey,
  type MarkElementClassKey,
} from '../LineChart';

export interface ChartsComponentNameToClassKey {
  MuiChartsAxis: 'root'; //  Only the root component of axes is styled. We should probably remove this one in v8
  MuiChartsXAxis: 'root'; //  Only the root component of axes is styled
  MuiChartsYAxis: 'root'; //  Only the root component of axes is styled

  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsLegend: 'root';
  MuiChartsGrid: ChartsGridClassKey;
  MuiChartsTooltip: ChartsTooltipClassKey;

  MuiChartsSvgSurface: 'root';

  // BarChart components
  MuiBarElement: BarElementClassKey;
  MuiBarLabel: BarLabelClassKey;

  // LineChart components
  MuiAreaElement: AreaElementClassKey;
  MuiLineElement: LineElementClassKey;
  MuiMarkElement: MarkElementClassKey;

  // ScatterChart components

  // Gauge components
  MuiGauge: GaugeClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsComponentNameToClassKey {}
}

// disable automatic export
export {};
