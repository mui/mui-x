import { BarLabelClassKey } from '../BarChart';
import { BarElementClassKey } from '../BarChart/BarElement';
import { ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import { ChartsGridClassKey } from '../ChartsGrid';
import { ChartsLegendClassKey } from '../ChartsLegend';

import { ChartsTooltipClassKey } from '../ChartsTooltip';
import { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';

export interface ChartsComponentNameToClassKey {
  MuiChartsAxis: 'root'; //  Only the root component of axes is styled
  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsGrid: ChartsGridClassKey;
  MuiChartsLegend: ChartsLegendClassKey;
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
