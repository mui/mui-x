import { BarLabelClassKey } from '../BarChart';
import { BarElementClassKey } from '../BarChart/BarElement';
import { ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import { ChartsGridClassKey } from '../ChartsGrid';
import { ChartsTooltipClassKey } from '../ChartsTooltip';
import { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';

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
  MuiBarElement: BarElementClassKey;
  MuiBarLabel: BarLabelClassKey;

  // LineChart components
  MuiAreaElement: AreaElementClassKey;
  MuiLineElement: LineElementClassKey;
  MuiMarkElement: MarkElementClassKey;

  // ScatterChart components
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsComponentNameToClassKey {}
}

// disable automatic export
export {};
