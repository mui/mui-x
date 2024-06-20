import type { BarLabelClassKey } from '../BarChart';
import type { BarElementClassKey } from '../BarChart/BarElement';
import type { ChartsAxisClassKey } from '../ChartsAxis';
import type { ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import type { ChartsGridClassKey } from '../ChartsGrid';
import type { ChartsLegendClassKey } from '../ChartsLegend';
import type { ChartsTooltipClassKey } from '../ChartsTooltip';
import type { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiChartsAxis: ChartsAxisClassKey;
  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsGrid: ChartsGridClassKey;
  MuiChartsLegend: ChartsLegendClassKey;
  MuiChartsTooltip: ChartsTooltipClassKey;

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
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
