import { BarElementClassKey } from '../BarChart/BarElement';
import { ChartsAxisClassKey } from '../ChartsAxis';
import { ChartsAxisHighlightClassKey } from '../ChartsAxisHighlight';
import { ChartsGridClassKey } from '../ChartsGrid';
import { ChartsLegendClassKey } from '../ChartsLegend';
import { ChartsReferenceLineClassKey } from '../ChartsReferenceLine';
import { ChartsTooltipClassKey } from '../ChartsTooltip';
import { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';
import { PieArcClassKey, PieArcLabelClassKey } from '../PieChart';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiChartsAxis: ChartsAxisClassKey;
  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsLegend: ChartsLegendClassKey;
  MuiChartsTooltip: ChartsTooltipClassKey;

  // BarChart components
  MuiBarElement: BarElementClassKey;

  // LineChart components
  MuiAreaElement: AreaElementClassKey;
  MuiLineElement: LineElementClassKey;
  MuiMarkElement: MarkElementClassKey;
  
  // ScatterChart components


  // PieChart components
  MuiPieArc: PieArcClassKey;
  MuiPieArcLabel: PieArcLabelClassKey;

  // Reference line
  MuiChartsReferenceLine: ChartsReferenceLineClassKey;

  // Grid
  MuiChartsGrid: ChartsGridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
